const express = require("express");
const router = express.Router();
const { verifyToken } = require("../controllers/authController");
const { pool } = require("../config/database");

// Obtener perfil
router.get("/perfil", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT nombre, email, telefono, direccion, foto FROM usuarios WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo perfil" });
  }
});

module.exports = router;
