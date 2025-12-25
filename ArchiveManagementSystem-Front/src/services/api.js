import axios from "axios";
import toast from "react-hot-toast";

// ⚠️ CRITICAL: Check if API URL is configured
const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
  console.error("❌❌❌ CRITICAL ERROR ❌❌❌");
  console.error("REACT_APP_API_URL is not defined!");
  console.error("Please create a .env file with:");
  console.error("REACT_APP_API_URL=http://localhost:8080");
  toast.error("Configuration error! Check console for details.");
}

console.log("========================================");
console.log("🔧 API Configuration");
console.log("========================================");
console.log("🌐 API URL:", API_URL || "❌ NOT CONFIGURED");
console.log("🌐 Base URL:", `${API_URL}/api` || "❌ NOT CONFIGURED");
console.log("========================================");

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Request interceptor with detailed logging
api.interceptors.request.use(
  async (config) => {
    console.log("========================================");
    console.log("🚀 OUTGOING REQUEST");
    console.log("========================================");
    console.log("📍 Method:", config.method?.toUpperCase());
    console.log("📍 URL:", config.url);
    console.log("📍 Full URL:", config.baseURL + config.url);
    console.log("📍 Timestamp:", new Date().toISOString());

    const token = localStorage.getItem("JWT_TOKEN");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 JWT Token:", token.substring(0, 30) + "...");
    } else {
      console.log("⚠️  No JWT Token found");
    }

    // Log request body for debugging
    if (config.data) {
      console.log("📦 Request Body:", config.data);
    }

    console.log("========================================");
    return config;
  },
  (error) => {
    console.error("❌ Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor with comprehensive error handling
api.interceptors.response.use(
  (response) => {
    console.log("========================================");
    console.log("✅ SUCCESSFUL RESPONSE");
    console.log("========================================");
    console.log("📍 Status:", response.status);
    console.log("📍 URL:", response.config.url);
    console.log("📍 Timestamp:", new Date().toISOString());

    if (response.data) {
      console.log("📦 Response Data:", response.data);
    }

    console.log("========================================");
    return response;
  },
  async (error) => {
    console.log("========================================");
    console.log("🔴 ERROR RESPONSE");
    console.log("========================================");

    // Network Error (Backend not running)
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      console.error("❌ NETWORK ERROR - Backend is not running!");
      console.error("👉 Make sure Spring Boot is running on:", API_URL);
      toast.error("Cannot connect to server. Is the backend running?");
      return Promise.reject(error);
    }

    // Timeout Error
    if (error.code === "ECONNABORTED") {
      console.error("❌ REQUEST TIMEOUT");
      toast.error("Request timed out. Server is slow or not responding.");
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url;

    console.log("📍 Status Code:", status || "No response");
    console.log("📍 URL:", url || "Unknown");
    console.log(
      "📍 Error Message:",
      error.response?.data?.message || error.message
    );

    if (error.response?.data) {
      console.log("📦 Error Data:", error.response.data);
    }

    // Handle specific error cases
    switch (status) {
      case 400:
        console.error("❌ BAD REQUEST (400)");
        const message = error.response?.data?.message || "Invalid request";
        toast.error(message);
        break;

      case 401:
        // Don't logout on 2FA verification errors
        if (url?.includes("/verify-2fa")) {
          console.log("⚠️  401 on verify-2fa - not logging out");
          break;
        }

        // Handle other 401 errors
        if (!originalRequest._retry) {
          console.error("❌ UNAUTHORIZED (401) - Session expired");
          toast.error("Session expired. Please login again.");

          // Clear all auth data
          localStorage.clear();

          // Redirect to login
          setTimeout(() => {
            window.location.href = "/login";
          }, 1000);
        }
        break;

      case 403:
        console.error("❌ FORBIDDEN (403) - Access denied");
        toast.error("Access denied. You don't have permission.");
        break;

      case 404:
        console.error("❌ NOT FOUND (404)");
        toast.error("Requested resource not found");
        break;

      case 500:
        console.error("❌ SERVER ERROR (500)");
        toast.error("Server error. Please try again later.");
        break;

      case 503:
        console.error("❌ SERVICE UNAVAILABLE (503)");
        toast.error("Server is temporarily unavailable");
        break;

      default:
        console.error(`❌ HTTP ERROR (${status})`);
        toast.error(`Request failed with status ${status}`);
    }

    console.log("========================================");
    return Promise.reject(error);
  }
);

// Helper function to test backend connection
export const testBackendConnection = async () => {
  try {
    console.log("🧪 Testing backend connection...");
    const response = await axios.get(`${API_URL}/api/csrf-token`, {
      timeout: 5000,
    });
    console.log("✅ Backend is reachable!");
    return true;
  } catch (error) {
    console.error("❌ Backend connection test failed!");
    console.error("Error:", error.message);
    return false;
  }
};

// Log API configuration on module load
console.log("📡 API Service initialized");
console.log("📡 Ready to make requests to:", `${API_URL}/api`);

export default api;
