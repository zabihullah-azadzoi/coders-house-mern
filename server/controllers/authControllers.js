const User = require("../models/User");
const Token = require("../models/Token");

const {
  generateOtp,
  sendOtp,
  verifyOtp,
  generateJwt,
  verifyJWT,
} = require("../services/authServices");
const { formatUserData } = require("../services/profileServices");

exports.sendOtpHandler = async (req, res) => {
  try {
    // 1 generate otp
    const { phoneNumber } = req.body;
    if (!phoneNumber)
      return res.status(400).json({ message: "Phone number is required" });

    // 2. hash otp
    const { otp, hash } = generateOtp(phoneNumber);

    // 3. send otp to phone number
    sendOtp(otp, phoneNumber)
      .then((response) => {
        res.json({
          message: "OTP is sent to provided phone number",
          hash,
          phoneNumber,
        });
      })
      .catch((e) => {
        console.log("Twilio Error --->", e.message);
        return res.status(500).json({ message: "Something went wrong!" });
      });

    // res.json({
    //   message: "OTP is sent to provided phone number",
    //   hash,
    //   phoneNumber,
    //   otp,
    // });
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
    if (!user) {
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

    res.json({ user: formatUserData(user), auth: true });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.refreshTokenHandler = async (req, res) => {
  try {
    // 1. get refresh token from cookies
    const { refreshToken: oldRefreshToken } = req.cookies;

    // 2. verify token if valid
    const data = verifyJWT(oldRefreshToken);
    if (!data || !data?._id)
      return res.status(400).json({ message: "Invalid refresh token!" });

    // 3. check if token is available in DB
    const existingToken = await Token.findOne({
      token: oldRefreshToken,
      userId: data._id,
    });
    if (!existingToken)
      return res.status(404).json({ message: "Invalid refresh token!" });

    // 4. check if user belonging to token exist
    const existingUser = await User.findById(data._id);
    if (!existingUser)
      return res
        .status(404)
        .json({ message: "User doesn't exist in our System!" });

    // 5. generate new refresh and access token
    const { accessToken, refreshToken } = generateJwt(data);

    // 6. save new refresh token in DB
    await Token.updateOne({ _id: existingToken._id }, { token: refreshToken });

    // 7 . set cookies
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    // 8. send response
    res.json({ user: formatUserData(existingUser), isAuth: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.logoutHandler = async (req, res) => {
  const user = req.user;
  const { refreshToken } = req.cookies;

  await Token.findOneAndRemove({
    token: refreshToken,
    userId: user._id,
  });

  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");

  res.json({ user: null, isAuth: false });
};

exports.deleteProfile = async (req, res) => {
  try {
    const user = req.user;
    const { refreshToken } = req.cookies;
    await Token.findOneAndDelete({
      token: refreshToken,
      userId: user._id,
    });

    await User.findByIdAndDelete(user._id);

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    res.json({ user: null, isAuth: false });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
