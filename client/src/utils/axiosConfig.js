// src/utils/axiosConfig.js
import axios from "axios";

const BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || "/api" // if you set VITE_API_URL, else rely on Vercel rewrite with "/api"
  : import.meta.env.VITE_API_URL || "http://localhost:2000/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // ensure cookies are sent
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized - maybe token expired");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
