import axiosInstance from ".";

export const sendOtp = async (phoneNumber) => {
  return await axiosInstance.post("/api/send-otp", {
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

export const logoutHandlerRequest = async () => {
  return await axiosInstance.get("/api/logout");
};

export const deleteProfile = async () => {
  return await axiosInstance.get("/api/delete-profile");
};
