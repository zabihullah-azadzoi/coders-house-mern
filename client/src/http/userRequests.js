import axiosInstance from ".";

export const getUser = async (id) => {
  return axiosInstance.get(`/api/user/${id}`);
};
