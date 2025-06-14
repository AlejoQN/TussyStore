const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { pool } = require("../config/database");

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Endpoint para subir imágenes
router.post("/upload", upload.array("imagenes"), (req, res) => {
  const urls = req.files.map((file) => file.filename); // Solo el nombre
  res.json({ urls });
});

// Crear producto
router.post("/", async (req, res) => {
  try {
    console.log("Nuevo producto recibido:", req.body); // <-- revisa la consola
    const {
      nombre,
      descripcion,
      precio,
      descuento,
      imagen,
      tallas,
      colores,
      stock,
      destacado,
      categoria,
    } = req.body;
    await pool.query(
      "INSERT INTO productos (nombre, descripcion, precio, descuento, imagen, tallas, colores, stock, destacado, categoria) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        nombre,
        descripcion,
        precio,
        descuento || 0,
        imagen,
        tallas,
        colores,
        stock,
        destacado || 0,
        categoria,
      ]
    );
    res.status(201).json({ message: "Producto creado" });
  } catch (err) {
    console.error("Error creando producto:", err);
    res.status(500).json({ error: "Error creando producto" });
  }
});

// Obtener productos
router.get("/", async (req, res) => {
  try {
    const [items] = await pool.query(
      "SELECT * FROM productos ORDER BY id DESC"
    );
    res.json({ items });
  } catch (err) {
    console.error("Error obteniendo productos:", err); // <-- AGREGA ESTE LOG
    res.status(500).json({ error: "Error obteniendo productos" });
  }
});

// Obtener todas las categorías
router.get("/categorias", async (req, res) => {
  try {
    const [categorias] = await pool.query(
      "SELECT id, nombre FROM categorias ORDER BY nombre"
    );
    res.json({ categorias });
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo categorías" });
  }
});

// Obtener productos relacionados (debe ir ANTES de router.get("/:id"))
router.get("/relacionados", async (req, res) => {
  const { categoria, exclude } = req.query;
  try {
    const [items] = await pool.query(
      "SELECT * FROM productos WHERE categoria = ? AND id != ? LIMIT 3",
      [categoria, exclude]
    );
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo relacionados" });
  }
});

// Obtener producto por ID (ESTO DEBE IR DESPUÉS)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT *, cantidad as stock FROM productos WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener producto" });
  }
});

// Actualizar producto por ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    descripcion,
    precio,
    descuento,
    imagen,
    tallas,
    colores,
    stock,
    destacado,
    categoria,
    referencia,
    codigo_barras,
    estado,
    variaciones,
  } = req.body;
  try {
    await pool.query(
      `UPDATE productos SET 
        nombre = ?, 
        descripcion = ?, 
        precio = ?, 
        descuento = ?, 
        imagen = ?, 
        tallas = ?, 
        colores = ?, 
        stock = ?, 
        destacado = ?, 
        categoria = ?, 
        referencia = ?, 
        codigo_barras = ?, 
        estado = ?, 
        variaciones = ?
      WHERE id = ?`,
      [
        nombre,
        descripcion,
        precio,
        descuento,
        imagen,
        tallas,
        colores,
        stock,
        destacado,
        categoria,
        referencia,
        codigo_barras,
        estado,
        JSON.stringify(variaciones || []),
        id,
      ]
    );
    res.json({ message: "Producto actualizado correctamente" });
  } catch (err) {
    console.error("Error actualizando producto:", err);
    res.status(500).json({ error: "Error actualizando producto" });
  }
});

module.exports = router;
