import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
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
          await axios.get(`${process.env.REACT_APP_BASE_URL}/api/refresh`, {
            withCredentials: true,
          });
          return axiosInstance(originalRequest);
        } catch (error) {
          console.log(error);
        }
      } else {
        return Promise.reject(error);
      }
    }
  }
);

export default axiosInstance;
