const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/database");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");

// 1. Registro de usuario
exports.register = async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    const [rows] = await pool.query("SELECT id FROM usuarios WHERE email = ?", [
      email,
    ]);
    if (rows.length > 0) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
      [nombre, email, hashed]
    );
    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (err) {
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
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Restablece tu contraseña - Tussy Store",
      html: `<p>Hola ${user.nombre},</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este enlace expirará en 1 hora.</p>`,
    });

    res.json({ message: "Correo de recuperación enviado" });
  } catch (err) {
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
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token requerido" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
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
    if (rows.length === 0)
      return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo perfil" });
  }
};

// 7. Actualizar perfil
exports.updateProfile = async (req, res) => {
  const { nombre, telefono, direccion } = req.body;
  try {
    await pool.query(
      "UPDATE usuarios SET nombre = ?, telefono = ?, direccion = ? WHERE id = ?",
      [nombre, telefono, direccion, req.user.id]
    );
    res.json({ message: "Perfil actualizado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error actualizando perfil" });
  }
};

// 8. Cambiar foto de perfil (usa multer para subir archivos)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `user_${req.user.id}_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

exports.cambiarFotoPerfil = [
  upload.single("foto"),
  async (req, res) => {
    if (!req.file)
      return res.status(400).json({ error: "No se subió ninguna imagen" });
    const url = `/uploads/${req.file.filename}`;
    await pool.query("UPDATE usuarios SET foto = ? WHERE id = ?", [
      url,
      req.user.id,
    ]);
    res.json({ foto: url });
  },
];
