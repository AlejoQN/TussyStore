const express = require("express");
const router = express.Router();
const { verifyToken } = require("../controllers/authController");
const adminController = require("../controllers/adminController");

router.get("/overview", verifyToken, adminController.getOverview);

module.exports = router;
