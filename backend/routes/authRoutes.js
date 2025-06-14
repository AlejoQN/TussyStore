const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { loginLimiter } = require("../middleware/security");
const passport = require("passport");

// Registro
router.post("/register", authController.register);

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
