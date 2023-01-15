import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// axios interceptor for refresh token
axiosInstance.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response !== null) {
      if (error.response.status === 401 && !error.config._retry) {
        error.config._retry = true;
        try {
          await axios.get("http://localhost:5000/api/refresh", {
            withCredentials: true,
          });
          return axiosInstance(originalRequest);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
);

export default axiosInstance;
