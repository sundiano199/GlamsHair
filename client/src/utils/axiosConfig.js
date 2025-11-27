import axios from "axios";

// Set the base URL to your Render backend
// Replace with your actual Render URL
const BASE_URL =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:2000/api";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Send cookies (HttpOnly JWT) with requests
  withCredentials: true,
});

// Optional: interceptors for logging or global error handling
axiosInstance.interceptors.response.use(
  (response) => response, // pass through successful responses
  (error) => {
    // handle token expiry or other global errors
    if (error.response && error.response.status === 401) {
      // optional: redirect to login page
      console.log("Unauthorized - maybe token expired");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
