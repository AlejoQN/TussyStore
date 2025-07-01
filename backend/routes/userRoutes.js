const express = require("express");
const router = express.Router();
const { verifyToken } = require("../controllers/authController");
const { pool } = require("../config/database");
const multer = require("multer");
const path = require("path");

// Configuración de multer para subir foto de perfil
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Obtener perfil
router.get("/perfil", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre, email, telefono, direccion, foto, rol FROM usuarios WHERE id = ?",
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

// Actualizar perfil
router.put("/perfil", verifyToken, async (req, res) => {
  const { nombre, email, telefono, direccion, foto } = req.body;
  try {
    await pool.query(
      "UPDATE usuarios SET nombre = ?, email = ?, telefono = ?, direccion = ?, foto = ? WHERE id = ?",
      [nombre, email, telefono, direccion, foto, req.user.id]
    );
    res.json({ message: "Perfil actualizado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error actualizando perfil" });
  }
});

// Subir foto de perfil
router.post("/subir-foto", verifyToken, upload.single("foto"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se subió ninguna imagen" });
  }
  res.json({ url: req.file.filename });
});

module.exports = router;
