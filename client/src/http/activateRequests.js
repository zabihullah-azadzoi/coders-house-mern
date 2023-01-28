import axiosInstance from ".";

export const activateProfileRequest = async (name, image, bio, username) => {
  return await axiosInstance.post("/api/activate", {
    name,
    image,
    bio,
    username,
  });
};

export const autoRefreshHandler = async () => {
  return await axiosInstance.get("/api/refresh");
};
