const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_TOKEN,
  {
    lazyLoading: true,
  }
);

exports.generateOtp = (phoneNumber) => {
  const otp = crypto.randomInt(1000, 9999);

  // 2. hash otp

  const expiresIn = Date.now() + 1000 * 60 * 2; // expires in 2 min

  const data = `${phoneNumber}.${otp}.${expiresIn}`;
  const hashedOtp = crypto
    .createHmac("sha256", process.env.OTP_HASH_SECRET)
    .update(data)
    .digest("hex");

  const hash = `${hashedOtp}.${expiresIn}`;

  return {
    otp,
    hash,
  };
};

exports.sendOtp = (otp, phoneNumber) => {
  return client.messages.create({
    body: `Your OTP for signing in to Coders House is: ${otp}`,
    from: process.env.TWILIO_FROM_NUMBER,
    to: phoneNumber,
  });
};

exports.verifyOtp = (phoneNumber, otp, expiresIn, hashedOtp) => {
  const data = `${phoneNumber}.${otp}.${expiresIn}`;
  const otpAfterHash = crypto
    .createHmac("sha256", process.env.OTP_HASH_SECRET)
    .update(data)
    .digest("hex");

  return hashedOtp === otpAfterHash;
};

exports.generateJwt = (user) => {
  const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1y",
  });

  return { accessToken, refreshToken };
};

exports.verifyJWT = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return err;
    return decoded;
  });
};
