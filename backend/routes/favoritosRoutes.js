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

  try {
    await pool.query(
      "DELETE FROM favoritos WHERE usuario_id = ? AND producto_id = ?",
      [usuario_id, producto_id]
    );
    // Siempre responde ok, aunque no exista
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar favorito" });
  }
});

router.post("/users/delete", verifyToken, async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ error: "No se enviaron usuarios a eliminar" });
  }
  try {
    const [result] = await pool.query(
      `DELETE FROM usuarios WHERE id IN (${ids.map(() => "?").join(",")})`,
      ids
    );
    // Opcional: verifica si realmente se eliminaron filas
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No se eliminaron usuarios" });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error("Error eliminando usuarios:", err);
    res.status(500).json({ error: "Error eliminando usuarios" });
  }
});

module.exports = router;
