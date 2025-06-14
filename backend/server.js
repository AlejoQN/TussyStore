require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mysql = require("mysql2/promise");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Seguridad y utilidades
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // Sube el límite para desarrollo
  standardHeaders: true,
  legacyHeaders: false,
});
// app.use(limiter); // <-- Si está descomentado, limita las peticiones

// Conexión a MySQL
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
};
const pool = mysql.createPool(dbConfig);
app.locals.pool = pool;
console.log("Conexión a MySQL exitosa");

// Sesiones y autenticación
app.use(
  session({
    secret: process.env.SESSION_SECRET || "tussysecret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Rutas
const productRoutes = require("./routes/productRoutes");
app.use("/api/productos", productRoutes);

const orderRoutes = require("./routes/orderRoutes");
app.use("/api/ordenes", orderRoutes);

const cartRoutes = require("./routes/cartRoutes");
app.use("/api/cart", cartRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const favoritosRoutes = require("./routes/favoritosRoutes");
app.use("/api/favoritos", favoritosRoutes);

const addressRoutes = require("./routes/addressRoutes");
app.use("/api/direcciones", addressRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/usuario", userRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const analyticsRoutes = require("./routes/analyticsRoutes");
app.use("/api/analytics", analyticsRoutes);

// Ruta de salud
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Tussy Store API running" });
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
