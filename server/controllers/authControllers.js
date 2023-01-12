const { generateOtp, sendOtp, verifyOtp } = require("../services/authServices");

exports.sendOtpHandler = async (req, res) => {
  try {
    // 1 generate otp
    const { phoneNumber } = req.body;
    if (!phoneNumber)
      return res.status(400).json({ message: "Phone number is required" });

    // 2. hash otp
    const { otp, hash } = generateOtp(phoneNumber);

    // 3. send otp to phone number
    sendOtp(otp, phoneNumber);
    res.json({
      message: "OTP is sent to provided phone number",
      hash,
      phoneNumber,
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { otp, phoneNumber, hash } = req.body;
    if (!otp || !phoneNumber || !hash)
      return res.status(400).json({ message: "All fields are required!" });

    const [hashedOtp, expiresIn] = hash.split(".");

    if (Date.now() > expiresIn)
      return res.status(400).json({ message: "OTP is expired" });

    const isValid = verifyOtp(phoneNumber, otp, expiresIn, hashedOtp);

    if (!isValid) return res.status(400).json({ message: "OTP is invalid" });
    res.json({ message: "correct" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
