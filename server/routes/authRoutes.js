const express = require("express");
const router = express.Router();

const {
  sendOtpHandler,
  verifyOtp,
  refreshTokenHandler,
  logoutHandler,
} = require("../controllers/authControllers");

const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/api/send-otp", sendOtpHandler);
router.post("/api/verify-otp", verifyOtp);
router.get("/api/refresh", refreshTokenHandler);
router.get("/api/logout", authMiddleware, logoutHandler);

module.exports = router;
