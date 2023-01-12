import axios from "axios";

export const sendOtp = async (phoneNumber) => {
  return await axios.post("http://localhost:5000/api/send-otp", {
    phoneNumber,
  });
};

export const verifyOtp = async (otp, phoneNumber, hash) => {
  return await axios.post("http://localhost:5000/api/verify-otp", {
    otp,
    phoneNumber,
    hash,
  });
};
