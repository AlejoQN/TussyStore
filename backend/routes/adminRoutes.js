const express = require("express");
const router = express.Router();
const { pool } = require("../config/database");
const { verifyToken } = require("../controllers/authController");
const adminController = require("../controllers/adminController");

router.get("/overview", verifyToken, adminController.getOverview);

router.get("/users", verifyToken, async (req, res) => {
  try {
    const [usuarios] = await pool.query(
      "SELECT id, nombre, email, telefono, rol, direccion, foto FROM usuarios"
    );
    res.json(usuarios);
  } catch (err) {
    console.error("Error obteniendo usuarios:", err);
    res.status(500).json({ error: "Error obteniendo usuarios" });
  }
});

router.post("/users/delete", verifyToken, async (req, res) => {
  console.log("Body recibido en /users/delete:", req.body);
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ error: "No se enviaron usuarios a eliminar" });
  }
  try {
    // Elimina carritos del usuario
    await pool.query(
      "DELETE FROM carrito WHERE usuario_id IN (" +
        ids.map(() => "?").join(",") +
        ")",
      ids
    );
    // Elimina otros datos relacionados (direcciones, pedidos, favoritos, etc.) si existen relaciones similares
    await pool.query(
      "DELETE FROM usuarios WHERE id IN (" + ids.map(() => "?").join(",") + ")",
      ids
    );
    res.json({ ok: true });
  } catch (err) {
    console.error("Error eliminando usuarios:", err);
    res.status(500).json({ error: "Error eliminando usuarios" });
  }
});

module.exports = router;
