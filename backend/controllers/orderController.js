const { sendMail } = require("../services/emailService");
const { pool } = require("../config/database");

exports.createOrder = async (req, res) => {
  const { direccion, metodoPago, items } = req.body;
  const usuario_id = req.user.id;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Calcular total
    const total = items.reduce(
      (sum, item) => sum + item.precio * item.cantidad,
      0
    );

    // Insertar la orden con usuario, dirección, método de pago y total
    const [orderResult] = await connection.query(
      "INSERT INTO pedidos (usuario, direccion, metodo_pago, estado, fecha, total) VALUES (?, ?, ?, ?, NOW(), ?)",
      [usuario_id, JSON.stringify(direccion), metodoPago, "Pendiente", total]
    );
    const orderId = orderResult.insertId;

    // Insertar productos de la orden y descontar stock
    for (const item of items) {
      await connection.query(
        "INSERT INTO ordenes_productos (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)",
        [orderId, item.producto_id, item.cantidad, item.precio]
      );
      await connection.query(
        "UPDATE productos SET stock = stock - ? WHERE id = ?",
        [item.cantidad, item.producto_id]
      );
    }

    await connection.commit();
    connection.release();

    // Obtener datos del usuario y la orden
    const [[usuario]] = await pool.query(
      "SELECT nombre, email FROM usuarios WHERE id = ?",
      [usuario_id]
    );
    const [[orden]] = await pool.query("SELECT * FROM pedidos WHERE id = ?", [
      orderId,
    ]);
    // Puedes obtener los productos de la orden si quieres más detalle

    // Enviar email de confirmación
    await sendMail({
      to: usuario.email,
      subject: "¡Tu compra en Tussy Store fue confirmada!",
      html: `
        <h2>¡Gracias por tu compra, ${usuario.nombre}!</h2>
        <p>Tu pedido <b>#${orden.id}</b> ha sido registrado exitosamente.</p>
        <p>Pronto recibirás más información sobre el estado de tu pedido.</p>
        <p>¡Gracias por confiar en Tussy Store!</p>
      `,
    });

    res.json({ ok: true, orderId });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("Error al crear la orden:", err);
    res.status(500).json({ error: "Error al crear la orden" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { order_id, nuevo_estado } = req.body;
  try {
    await pool.query("UPDATE pedidos SET estado = ? WHERE id = ?", [
      nuevo_estado,
      order_id,
    ]);
    // Obtener email del usuario
    const [[pedido]] = await pool.query(
      "SELECT usuario FROM pedidos WHERE id = ?",
      [order_id]
    );
    const [[usuario]] = await pool.query(
      "SELECT nombre, email FROM usuarios WHERE id = ?",
      [pedido.usuario]
    );
    // Enviar email de notificación
    await sendMail({
      to: usuario.email,
      subject: `Actualización de tu pedido #${order_id}`,
      html: `
        <h2>Hola ${usuario.nombre},</h2>
        <p>El estado de tu pedido <b>#${order_id}</b> ha cambiado a: <b>${nuevo_estado}</b>.</p>
        <p>¡Gracias por confiar en Tussy Store!</p>
      `,
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Error actualizando estado del pedido" });
  }
};

// Órdenes del usuario autenticado
exports.getUserOrders = async (req, res) => {
  const usuario_id = req.user.id;
  try {
    const [ordenes] = await pool.query(
      "SELECT * FROM pedidos WHERE usuario = ? ORDER BY fecha DESC",
      [usuario_id]
    );

    for (const orden of ordenes) {
      const [productos] = await pool.query(
        `SELECT 
            op.cantidad,
            op.precio_unitario as precio,
            pr.nombre,
            pr.imagen,
            op.talla,
            op.color
         FROM ordenes_productos op
         JOIN productos pr ON op.producto_id = pr.id
         WHERE op.pedido_id = ?`,
        [orden.id]
      );
      orden.producto = productos[0] || null;
    }

    res.json({ ordenes });
  } catch (err) {
    console.error("Error en getUserOrders:", err); // <-- AGREGA ESTA LÍNEA
    res.status(500).json({ error: "Error al obtener las órdenes" });
  }
};

// Todas las órdenes (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const [ordenes] = await pool.query(`
      SELECT 
        p.id,
        p.estado,
        p.fecha,
        p.usuario,
        u.nombre AS usuario_nombre,
        op.cantidad,
        pr.nombre AS producto_nombre,
        c.nombre AS categoria_nombre,
        (op.precio_unitario * op.cantidad) AS costo
      FROM pedidos p
      JOIN usuarios u ON p.usuario = u.id
      LEFT JOIN ordenes_productos op ON op.pedido_id = p.id
      LEFT JOIN productos pr ON op.producto_id = pr.id
      LEFT JOIN categorias c ON pr.categoria = c.id
      ORDER BY p.fecha DESC
    `);
    res.json({ ordenes });
  } catch (err) {
    console.error("Error en getAllOrders:", err);
    res.status(500).json({ error: "Error al obtener las órdenes" });
  }
};
