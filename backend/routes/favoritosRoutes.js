const express = require("express");
const router = express.Router();
const { pool } = require("../config/database");
const { verifyToken } = require("../controllers/authController"); // <-- CORRIGE ESTA LÍNEA

// Obtener favoritos del usuario
router.get("/", verifyToken, async (req, res) => {
  const usuario_id = req.user.id;
  try {
    const [favoritos] = await pool.query(
      `SELECT f.id, p.nombre, p.imagen, p.precio
       FROM favoritos f
       JOIN productos p ON f.producto_id = p.id
       WHERE f.usuario_id = ?`,
      [usuario_id]
    );
    res.json({ favoritos });
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo favoritos" });
  }
});

// Agregar a favoritos
router.post("/", verifyToken, async (req, res) => {
  const usuario_id = req.user.id;
  const { productoId } = req.body;
  try {
    await pool.query(
      "INSERT IGNORE INTO favoritos (usuario_id, producto_id) VALUES (?, ?)",
      [usuario_id, productoId]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Error agregando a favoritos" });
  }
});

// Eliminar favorito
router.delete("/:id", verifyToken, async (req, res) => {
  const usuario_id = req.user.id;
  const producto_id = req.params.id;

  // LOG para depuración
  console.log("Intentando eliminar favorito:", { usuario_id, producto_id });

  try {
    const [result] = await req.app.locals.pool.query(
      "DELETE FROM favoritos WHERE usuario_id = ? AND producto_id = ?",
      [usuario_id, producto_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Favorito no encontrado" });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error("Error al eliminar favorito:", err);
    res.status(500).json({ error: "Error al eliminar favorito" });
  }
});

module.exports = router;
