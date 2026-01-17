const express = require("express");
const router = express.Router();

const GymController = require("../Controllers/gym");
const auth = require("../Auth/auth");

/* =========================
   AUTH ROUTES
========================= */

// Public
router.post("/register", GymController.register);
router.post("/login", GymController.login);
router.post("/reset-password/sendOtp", GymController.sendOtp);
router.post("/reset-password/checkOtp", GymController.checkOtp);
router.post("/reset-password", GymController.resetPassword);

// Protected
router.put("/update-profile-pic", auth, GymController.updateProfilePic);

module.exports = router;
