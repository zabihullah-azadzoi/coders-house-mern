const crypto = require("crypto");
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
  client.messages
    .create({
      body: `Your OTP for signing in to Coders House is: ${otp}`,
      from: process.env.TWILIO_FROM_NUMBER,
      to: phoneNumber,
    })
    .then((res) => {
      // console.log(res)
    })
    .catch((e) => console.log("Twilio Error --->", e));
};

exports.verifyOtp = (phoneNumber, otp, expiresIn, hashedOtp) => {
  const data = `${phoneNumber}.${otp}.${expiresIn}`;
  const otpAfterHash = crypto
    .createHmac("sha256", process.env.OTP_HASH_SECRET)
    .update(data)
    .digest("hex");

  return hashedOtp === otpAfterHash;
};