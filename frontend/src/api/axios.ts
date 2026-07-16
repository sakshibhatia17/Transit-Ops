import axios from "axios";

let rawBaseUrl = import.meta.env.VITE_API_URL || "";
rawBaseUrl = rawBaseUrl.replace(/\/+$/, ""); // Remove trailing slashes
const baseURL = rawBaseUrl.endsWith("/api") ? rawBaseUrl : `${rawBaseUrl}/api`;

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Global response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Try to extract the backend error message, fallback to generic message
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred while communicating with the server.";
    
    // Normalize it so `error.message` can be used consistently in UI components
    error.message = message;
    
    return Promise.reject(error);
  }
);

export default api;