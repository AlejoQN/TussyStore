const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getAllOrders,
} = require("../controllers/orderController");
const { verifyToken } = require("../controllers/authController");
const { pool } = require("../config/database");

// Crear orden
router.post("/", verifyToken, createOrder);

// Órdenes del usuario autenticado
router.get("/", verifyToken, getUserOrders);

// Todas las órdenes (admin)
router.get("/all", verifyToken, getAllOrders);

router.put("/estado/:id", verifyToken, async (req, res) => {
  const orderId = req.params.id;
  const { nuevo_estado } = req.body;
  try {
    await pool.query("UPDATE pedidos SET estado = ? WHERE id = ?", [
      nuevo_estado,
      orderId,
    ]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Error actualizando estado del pedido" });
  }
});

router.put("/cancelar/:id", verifyToken, async (req, res) => {
  const orderId = req.params.id;
  const usuario_id = req.user.id;
  try {
    // Solo permite cancelar si la orden es del usuario y está en proceso
    const [orden] = await pool.query(
      "SELECT * FROM pedidos WHERE id = ? AND usuario = ? AND estado = 'En Proceso'",
      [orderId, usuario_id]
    );
    if (!orden.length) {
      return res.status(400).json({ error: "No puedes cancelar esta orden" });
    }
    await pool.query("UPDATE pedidos SET estado = 'Cancelado' WHERE id = ?", [
      orderId,
    ]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Error al cancelar la orden" });
  }
});

// Obtener detalle de una orden por ID
router.get("/:id", verifyToken, async (req, res) => {
  const orderId = req.params.id;
  const usuario_id = req.user.id;
  try {
    const [[orden]] = await pool.query(
      "SELECT * FROM pedidos WHERE id = ? AND usuario = ?",
      [orderId, usuario_id]
    );
    if (!orden) return res.status(404).json({ error: "Orden no encontrada" });

    // Productos de la orden
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
      [orderId]
    );
    orden.productos = productos;
    // Si la dirección está en formato JSON
    try {
      orden.direccion = JSON.parse(orden.direccion);
    } catch {}
    res.json({ orden });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener la orden" });
  }
});

module.exports = router;
