const express = require("express");
const router = express.Router();

router.get("/ordenes", async (req, res) => {
  const pool = req.app.locals.pool;
  const { periodo = "dia" } = req.query;
  let groupBy, dateFormat;
  if (periodo === "semana") {
    groupBy = "YEARWEEK(fecha)";
    dateFormat = "CONCAT(YEAR(fecha), '-', WEEK(fecha))";
  } else if (periodo === "mes") {
    groupBy = "DATE_FORMAT(fecha, '%Y-%m')";
    dateFormat = "DATE_FORMAT(fecha, '%Y-%m')";
  } else {
    groupBy = "DATE(fecha)";
    dateFormat = "DATE(fecha)";
  }
  const [rows] = await pool.query(
    `SELECT ${dateFormat} as periodo, COUNT(*) as total
     FROM pedidos
     GROUP BY periodo
     ORDER BY periodo ASC`
  );
  res.json(rows);
});
router.get("/ventas", async (req, res) => {
  const pool = req.app.locals.pool;
  const { periodo = "dia" } = req.query;
  let groupBy, dateFormat;
  if (periodo === "semana") {
    groupBy = "YEARWEEK(fecha)";
    dateFormat = "CONCAT(YEAR(fecha), '-', WEEK(fecha))";
  } else if (periodo === "mes") {
    groupBy = "DATE_FORMAT(fecha, '%Y-%m')";
    dateFormat = "DATE_FORMAT(fecha, '%Y-%m')";
  } else {
    groupBy = "DATE(fecha)";
    dateFormat = "DATE(fecha)";
  }
  const [rows] = await pool.query(
    `SELECT ${dateFormat} as periodo, SUM(total) as total
     FROM pedidos
     WHERE estado = 'Completo'
     GROUP BY ${groupBy}
     ORDER BY periodo ASC`
  );
  res.json(rows);
});
router.get("/usuarios", async (req, res) => {
  const pool = req.app.locals.pool;
  const { periodo = "dia" } = req.query;
  let groupBy, dateFormat;
  if (periodo === "semana") {
    groupBy = "YEARWEEK(creado_en)";
    dateFormat = "CONCAT(YEAR(creado_en), '-', WEEK(creado_en))";
  } else if (periodo === "mes") {
    groupBy = "DATE_FORMAT(creado_en, '%Y-%m')";
    dateFormat = "DATE_FORMAT(creado_en, '%Y-%m')";
  } else {
    groupBy = "DATE(creado_en)";
    dateFormat = "DATE(creado_en)";
  }
  const [rows] = await pool.query(
    `SELECT ${dateFormat} as periodo, COUNT(*) as total
     FROM usuarios
     GROUP BY ${groupBy}
     ORDER BY periodo ASC`
  );
  res.json(rows);
});

module.exports = router;
