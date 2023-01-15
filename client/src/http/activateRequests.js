import axiosInstance from ".";

export const activateProfileRequest = async (name, image) => {
  return await axiosInstance.post("/api/activate", {
    name,
    image,
  });
};

export const autoRefreshHandler = async () => {
  return await axiosInstance.get("/api/refresh");
};
