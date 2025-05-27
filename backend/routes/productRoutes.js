const express = require("express");
const router = express.Router();
const Product = require("../middleware/models/Product");

// GET /api/productos?busqueda=texto
router.get("/", async (req, res) => {
  const { busqueda } = req.query;
  try {
    const items = await Product.searchByName(busqueda);
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: "Error buscando productos" });
  }
});

module.exports = router;
