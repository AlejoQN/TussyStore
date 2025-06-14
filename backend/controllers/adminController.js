const { pool } = require("../config/database");

exports.getOverview = async (req, res) => {
  try {
    // Ganancias totales (solo órdenes completadas)
    const [[{ ganancias }]] = await pool.query(
      "SELECT IFNULL(SUM(total),0) as ganancias FROM pedidos WHERE estado='Completado'"
    );

    // Órdenes totales
    const [[{ ordenes }]] = await pool.query(
      "SELECT COUNT(*) as ordenes FROM pedidos"
    );

    // Clientes totales (usuarios con rol 'cliente')
    const [[{ clientes }]] = await pool.query(
      "SELECT COUNT(*) as clientes FROM usuarios WHERE rol='cliente'"
    );

    // Balance (puedes ajustar la lógica según tu negocio)
    const [[{ balance }]] = await pool.query(
      "SELECT IFNULL(SUM(total),0) as balance FROM pedidos WHERE estado='Completado'"
    );

    // Órdenes recientes (últimas 5)
    const [ordenesRecientes] = await pool.query(`
      SELECT p.id, u.nombre AS usuario_nombre, pr.nombre AS producto_nombre, c.nombre AS categoria_nombre, (op.precio_unitario * op.cantidad) AS costo, p.estado
      FROM pedidos p
      JOIN usuarios u ON p.usuario = u.id
      JOIN ordenes_productos op ON op.pedido_id = p.id
      JOIN productos pr ON op.producto_id = pr.id
      JOIN categorias c ON pr.categoria = c.id
      ORDER BY p.fecha DESC
      LIMIT 5
    `);

    res.json({
      stats: {
        ganancias: ganancias || 0,
        ordenes: ordenes || 0,
        clientes: clientes || 0,
        balance: balance || 0,
      },
      ordenesRecientes,
    });
  } catch (err) {
    console.error("Error en overview admin:", err);
    res.status(500).json({ error: "Error obteniendo overview" });
  }
};
