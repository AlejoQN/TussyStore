const express = require("express");
const router = express.Router();
const { pool } = require("../config/database");

// POST /api/ordenes
router.post("/", async (req, res) => {
  const { direccion, metodoPago, items } = req.body;
  try {
    // Guarda la orden en la base de datos (ajusta según tu modelo real)
    await pool.query(
      "INSERT INTO pedidos (direccion, metodo_pago, estado, fecha) VALUES (?, ?, ?, NOW())",
      [JSON.stringify(direccion), metodoPago, "pendiente"]
    );
    // Aquí puedes agregar lógica para guardar los items y procesar el pago
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Error al crear la orden" });
  }
});

module.exports = router;
