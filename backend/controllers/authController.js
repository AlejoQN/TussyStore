const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/database");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");

// 1. Registro de usuario
exports.register = async (req, res) => {
  const { nombre, email, password, edad, rol, telefono, direccion } = req.body;
  const foto = req.file ? req.file.filename : null;
  try {
    const [rows] = await pool.query("SELECT id FROM usuarios WHERE email = ?", [
      email,
    ]);
    if (rows.length > 0) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO usuarios (nombre, email, password, edad, rol, telefono, direccion, foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [nombre, email, hashed, edad, rol || "cliente", telefono, direccion, foto]
    );
    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    console.error("Error en el registro:", err);
    res.status(500).json({ error: "Error en el registro" });
  }
};

// 2. Login de usuario
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }
    // Generar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );
    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Error en el login" });
  }
};

// 3. Forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Email no registrado" });
    }
    const user = rows[0];
    // Generar token de reset
    const resetToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Configurar nodemailer
    const transporter = require("nodemailer").createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // LOG: Verifica datos de envío
    console.log("Intentando enviar correo a:", email);

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Restablece tu contraseña - Tussy Store",
      html: `
        <h2>Hola ${user.nombre},</h2>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este enlace expirará en 1 hora.</p>
      `,
    });

    console.log("Correo enviado correctamente a:", email);
    res.json({ message: "Correo de recuperación enviado" });
  } catch (err) {
    console.error("Error enviando correo:", err);
    res.status(500).json({ error: "Error enviando el correo" });
  }
};

// 4. Reset password
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashed = await bcrypt.hash(password, 10);
    await pool.query("UPDATE usuarios SET password = ? WHERE id = ?", [
      hashed,
      decoded.id,
    ]);
    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (err) {
    res.status(400).json({ error: "Token inválido o expirado" });
  }
};

// 5. Middleware de verificación de token (para rutas protegidas)
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("verifyToken: token recibido =", token); // <-- log para debug
  if (!token) {
    console.warn("verifyToken: No token enviado");
    return res.status(401).json({ error: "Token requerido" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.warn("verifyToken: Token inválido", err);
      return res.status(403).json({ error: "Token inválido" });
    }
    req.user = user;
    next();
  });
};

// 6. Obtener perfil
exports.getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre, email, telefono, direccion, foto FROM usuarios WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo perfil" });
  }
};

// 7. Actualizar perfil
exports.updateProfile = async (req, res) => {
  const { nombre, telefono, direccion, foto } = req.body;
  try {
    await pool.query(
      "UPDATE usuarios SET nombre = ?, telefono = ?, direccion = ?, foto = ? WHERE id = ?",
      [nombre, telefono, direccion, foto, req.user.id]
    );
    res.json({ message: "Perfil actualizado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error actualizando perfil" });
  }
};

// Cambiar contraseña desde el perfil
exports.changePassword = async (req, res) => {
  const { actual, nueva } = req.body;
  try {
    // Obtener usuario actual
    const [rows] = await pool.query(
      "SELECT password FROM usuarios WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Usuario no encontrado" });

    // Validar contraseña actual
    const valid = await bcrypt.compare(actual, rows[0].password);
    if (!valid)
      return res.status(400).json({ error: "Contraseña actual incorrecta" });

    // Guardar nueva contraseña
    const hashed = await bcrypt.hash(nueva, 10);
    await pool.query("UPDATE usuarios SET password = ? WHERE id = ?", [
      hashed,
      req.user.id,
    ]);
    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error actualizando contraseña" });
  }
};
