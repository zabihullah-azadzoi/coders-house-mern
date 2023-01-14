const User = require("../models/User");
const Token = require("../models/Token");

const {
  generateOtp,
  sendOtp,
  verifyOtp,
  generateJwt,
} = require("../services/authServices");

exports.sendOtpHandler = async (req, res) => {
  try {
    // 1 generate otp
    const { phoneNumber } = req.body;
    if (!phoneNumber)
      return res.status(400).json({ message: "Phone number is required" });

    // 2. hash otp
    const { otp, hash } = generateOtp(phoneNumber);

    // 3. send otp to phone number
    // sendOtp(otp, phoneNumber);

    res.json({
      message: "OTP is sent to provided phone number",
      hash,
      phoneNumber,
      otp,
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    // 1. verify otp using hash
    const { otp, phoneNumber, hash } = req.body;
    if (!otp || !phoneNumber || !hash)
      return res.status(400).json({ message: "All fields are required!" });

    const [hashedOtp, expiresIn] = hash.split(".");

    if (Date.now() > expiresIn)
      return res.status(400).json({ message: "OTP is expired" });

    const isValid = verifyOtp(phoneNumber, otp, expiresIn, hashedOtp);

    if (!isValid) return res.status(400).json({ message: "OTP is invalid" });

    // 2. create user in DB
    let user = await User.findOne({ phone: phoneNumber });
    if (user) {
      return res.json({ message: "User already exist!" });
    }
    {
      user = await new User({ phone: phoneNumber }).save();
    }
    // 3. generate jwt and send to client
    const { accessToken, refreshToken } = generateJwt(user);

    // 4. save refresh token to DB
    await new Token({ token: refreshToken, userId: user._id }).save();

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    res.json({ user, auth: true });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.refreshTokenHandler = (req, res) => {
  // 1. get refresh token from cookies
  // 2. verify token if valid
  // 3. check if token is available in DB
  // 4. check if user belonging to token exist
  // 5. generate new refresh and access token
  // 6. save new refresh token in DB
  // 7 . set cookies
  // 8. send response
};
