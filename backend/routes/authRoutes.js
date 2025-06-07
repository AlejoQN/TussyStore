const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { loginLimiter } = require("../middleware/security");
const passport = require("passport");
require("../services/googleAuth");

// Registro
router.post("/register", authController.register);

// Login (con rate limit)
router.post("/login", loginLimiter, authController.login);

// Recuperar contraseña
router.post("/recuperar", authController.forgotPassword);

// Reset password
router.post("/reset-password", authController.resetPassword);

// Perfil (requiere token)
router.get("/perfil", authController.verifyToken, authController.getProfile);
router.put("/perfil", authController.verifyToken, authController.updateProfile);

// Cambiar foto de perfil
router.post(
  "/foto",
  authController.verifyToken,
  authController.cambiarFotoPerfil
);

// Iniciar login con Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback de Google
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: process.env.FRONTEND_URL + "/login",
  }),
  (req, res) => {
    const token = req.user.token;
    res.redirect(`${process.env.FRONTEND_URL}/google-auth?token=${token}`);
  }
);

module.exports = router;
