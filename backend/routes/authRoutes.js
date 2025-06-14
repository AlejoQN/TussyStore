const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const multer = require("multer");
const path = require("path");
const { loginLimiter } = require("../middleware/security"); // <-- AGREGA ESTA LÍNEA

// Configuración de multer para la foto de perfil
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Registro (usa multer para procesar form-data)
router.post("/register", upload.single("foto"), authController.register);

// Login (con rate limit)
router.post("/login", loginLimiter, authController.login);

// Recuperar contraseña
router.post("/recuperar", authController.forgotPassword);

// Reset password
router.post("/reset-password", authController.resetPassword);

// Cambiar password
router.post(
  "/cambiar-password",
  authController.verifyToken,
  authController.changePassword
);

// Perfil (requiere token)
router.get("/perfil", authController.verifyToken, authController.getProfile);
router.put("/perfil", authController.verifyToken, authController.updateProfile);

module.exports = router;
