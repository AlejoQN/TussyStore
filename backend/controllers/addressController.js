const { pool } = require("../config/database");

exports.createAddress = async (req, res) => {
  const usuario_id = req.user.id;
  const {
    nombre,
    direccion,
    ciudad,
    departamento,
    telefono,
    barrio,
    municipio,
    apartamento,
    indicaciones,
  } = req.body;
  try {
    await pool.query(
      "INSERT INTO direcciones (usuario_id, nombre, direccion, ciudad, departamento, telefono, barrio, municipio, apartamento, indicaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        usuario_id,
        nombre,
        direccion,
        ciudad,
        departamento,
        telefono,
        barrio,
        municipio,
        apartamento,
        indicaciones,
      ]
    );
    res.json({ message: "Dirección guardada" });
  } catch (err) {
    res.status(500).json({ error: "Error al guardar dirección" });
  }
};

exports.getUserAddresses = async (req, res) => {
  const usuario_id = req.user.id;
  try {
    const [direcciones] = await pool.query(
      "SELECT * FROM direcciones WHERE usuario_id = ?",
      [usuario_id]
    );
    res.json({ direcciones });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener direcciones" });
  }
};

exports.updateAddress = async (req, res) => {
  const usuario_id = req.user.id;
  const id = req.params.id;
  const {
    nombre,
    direccion,
    ciudad,
    departamento,
    telefono,
    barrio,
    municipio,
    apartamento,
    indicaciones,
  } = req.body;
  try {
    await pool.query(
      "UPDATE direcciones SET nombre=?, direccion=?, ciudad=?, departamento=?, telefono=?, barrio=?, municipio=?, apartamento=?, indicaciones=? WHERE id=? AND usuario_id=?",
      [
        nombre,
        direccion,
        ciudad,
        departamento,
        telefono,
        barrio,
        municipio,
        apartamento,
        indicaciones,
        id,
        usuario_id,
      ]
    );
    res.json({ message: "Dirección actualizada" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar dirección" });
  }
};

exports.deleteAddress = async (req, res) => {
  const usuario_id = req.user.id;
  const id = req.params.id;
  try {
    await pool.query(
      "DELETE FROM direcciones WHERE id = ? AND usuario_id = ?",
      [id, usuario_id]
    );
    res.json({ message: "Dirección eliminada" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar dirección" });
  }
};
