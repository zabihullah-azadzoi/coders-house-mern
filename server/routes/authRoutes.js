const express = require("express");
const router = express.Router();

const { sendOtpHandler, verifyOtp } = require("../controllers/authControllers");

router.post("/api/send-otp", sendOtpHandler);
router.post("/api/verify-otp", verifyOtp);

module.exports = router;
