import axios from "axios";
import { getToken } from "./auth";

// Ensure we have the correct base URL
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL,
  timeout: 10000,
});

// Log requests for debugging
api.interceptors.request.use((config) => {
  console.log(`API Request to: ${config.baseURL}${config.url}`);

  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors and token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.message);

    if (error.response?.status === 401) {
      localStorage.removeItem("jwt_token");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;
