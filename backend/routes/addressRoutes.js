const express = require("express");
const router = express.Router();
const { verifyToken } = require("../controllers/authController");
const addressController = require("../controllers/addressController");

router.post("/", verifyToken, addressController.createAddress);
router.get("/", verifyToken, addressController.getUserAddresses);
router.put("/:id", verifyToken, addressController.updateAddress);
router.delete("/:id", verifyToken, addressController.deleteAddress);

module.exports = router;
