import axiosInstance from ".";

export const sendOtp = async (phoneNumber) => {
  return await axiosInstance.post("api/send-otp", {
    phoneNumber,
  });
};

export const verifyOtp = async (otp, phoneNumber, hash) => {
  return await axiosInstance.post("/api/verify-otp", {
    otp,
    phoneNumber,
    hash,
  });
};
