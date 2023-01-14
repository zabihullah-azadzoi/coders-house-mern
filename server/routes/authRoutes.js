const express = require("express");
const router = express.Router();

const {
  sendOtpHandler,
  verifyOtp,
  refreshTokenHandler,
} = require("../controllers/authControllers");

router.post("/api/send-otp", sendOtpHandler);
router.post("/api/verify-otp", verifyOtp);
router.get("/api/refresh", refreshTokenHandler);

module.exports = router;
