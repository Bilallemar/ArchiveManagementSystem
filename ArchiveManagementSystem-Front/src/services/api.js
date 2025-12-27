// import axios from "axios";
// import toast from "react-hot-toast";

// // ⚠️ CRITICAL: Check if API URL is configured
// const API_URL = process.env.REACT_APP_API_URL;

// if (!API_URL) {
//   console.error("❌❌❌ CRITICAL ERROR ❌❌❌");
//   console.error("REACT_APP_API_URL is not defined!");
//   console.error("Please create a .env file with:");
//   console.error("REACT_APP_API_URL=http://localhost:8080");
//   toast.error("Configuration error! Check console for details.");
// }

// console.log("========================================");
// console.log("🔧 API Configuration");
// console.log("========================================");
// console.log("🌐 API URL:", API_URL || "❌ NOT CONFIGURED");
// console.log("🌐 Base URL:", `${API_URL}/api` || "❌ NOT CONFIGURED");
// console.log("========================================");

// const api = axios.create({
//   baseURL: `${API_URL}/api`,
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
//   timeout: 10000, // 10 second timeout
// });

// // Request interceptor with detailed logging
// api.interceptors.request.use(
//   async (config) => {
//     console.log("========================================");
//     console.log("🚀 OUTGOING REQUEST");
//     console.log("========================================");
//     console.log("📍 Method:", config.method?.toUpperCase());
//     console.log("📍 URL:", config.url);
//     console.log("📍 Full URL:", config.baseURL + config.url);
//     console.log("📍 Timestamp:", new Date().toISOString());

//     const token = localStorage.getItem("JWT_TOKEN");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//       console.log("🔑 JWT Token:", token.substring(0, 30) + "...");
//     } else {
//       console.log("⚠️  No JWT Token found");
//     }

//     // Log request body for debugging
//     if (config.data) {
//       console.log("📦 Request Body:", config.data);
//     }

//     console.log("========================================");
//     return config;
//   },
//   (error) => {
//     console.error("❌ Request Interceptor Error:", error);
//     return Promise.reject(error);
//   }
// );

// // Response interceptor with comprehensive error handling
// api.interceptors.response.use(
//   (response) => {
//     console.log("========================================");
//     console.log("✅ SUCCESSFUL RESPONSE");
//     console.log("========================================");
//     console.log("📍 Status:", response.status);
//     console.log("📍 URL:", response.config.url);
//     console.log("📍 Timestamp:", new Date().toISOString());

//     if (response.data) {
//       console.log("📦 Response Data:", response.data);
//     }

//     console.log("========================================");
//     return response;
//   },
//   async (error) => {
//     console.log("========================================");
//     console.log("🔴 ERROR RESPONSE");
//     console.log("========================================");

//     // Network Error (Backend not running)
//     if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
//       console.error("❌ NETWORK ERROR - Backend is not running!");
//       console.error("👉 Make sure Spring Boot is running on:", API_URL);
//       toast.error("Cannot connect to server. Is the backend running?");
//       return Promise.reject(error);
//     }

//     // Timeout Error
//     if (error.code === "ECONNABORTED") {
//       console.error("❌ REQUEST TIMEOUT");
//       toast.error("Request timed out. Server is slow or not responding.");
//       return Promise.reject(error);
//     }

//     const originalRequest = error.config;
//     const status = error.response?.status;
//     const url = originalRequest?.url;
//     const errorData = error.response?.data;

//     console.log("📍 Status Code:", status || "No response");
//     console.log("📍 URL:", url || "Unknown");
//     console.log("📍 Error Message:", errorData?.message || error.message);

//     if (errorData) {
//       console.log("📦 Error Data:", errorData);
//     }

//     // ============================================
//     // CRITICAL: Only handle 401 for authentication
//     // ============================================
//     if (status === 401) {
//       console.log("🔍 Analyzing 401 error...");

//       // Check if this is a login attempt (no token should exist yet)
//       const hasToken = localStorage.getItem("JWT_TOKEN");

//       // 1. Login/Signin errors - NEVER logout, just show error
//       if (
//         url?.includes("/signin") ||
//         url?.includes("/login") ||
//         url?.includes("/public")
//       ) {
//         console.log("⚠️  401 on authentication endpoint - showing error only");
//         const loginError = errorData?.message || "Invalid username or password";
//         toast.error(loginError);
//         return Promise.reject(error);
//       }

//       // 2. 2FA verification errors - NEVER logout, just show error
//       if (url?.includes("/verify-2fa") || url?.includes("/2fa")) {
//         console.log("⚠️  401 on 2FA endpoint - showing error only");
//         const twoFaError = errorData?.message || "Invalid verification code";
//         toast.error(twoFaError);
//         return Promise.reject(error);
//       }

//       // 3. Token-related 401 on protected endpoints
//       // Only logout if we actually have a token (means it's expired/invalid)
//       if (hasToken && !originalRequest._retry) {
//         // Check if the error message specifically mentions token/auth issues
//         const errorMsg = errorData?.message?.toLowerCase() || "";
//         const isTokenError =
//           errorMsg.includes("token") ||
//           errorMsg.includes("expired") ||
//           errorMsg.includes("invalid") ||
//           errorMsg.includes("jwt") ||
//           errorMsg.includes("unauthorized");

//         if (isTokenError) {
//           console.error("❌ Token expired/invalid - logging out");
//           originalRequest._retry = true;
//           toast.error("Your session has expired. Please login again.");

//           // Clear all auth data
//           localStorage.clear();

//           // Redirect to login after a short delay
//           setTimeout(() => {
//             window.location.href = "/login";
//           }, 1500);

//           return Promise.reject(error);
//         } else {
//           // 401 but not a token issue - might be business logic
//           console.log("⚠️  401 but not a token error - showing message only");
//           const msg = errorData?.message || "Unauthorized action";
//           toast.error(msg);
//           return Promise.reject(error);
//         }
//       }

//       // If no token exists, just show the error
//       if (!hasToken) {
//         console.log("⚠️  401 but no token exists - showing error only");
//         const msg = errorData?.message || "Authentication required";
//         toast.error(msg);
//         return Promise.reject(error);
//       }
//     }

//     // ============================================
//     // Handle all other status codes - NEVER logout
//     // ============================================
//     switch (status) {
//       case 400:
//         console.error("❌ BAD REQUEST (400)");
//         const badRequestMsg =
//           errorData?.message || errorData?.error || "Invalid request data";
//         toast.error(badRequestMsg);
//         break;

//       case 403:
//         console.error("❌ FORBIDDEN (403) - Access denied");
//         const forbiddenMsg =
//           errorData?.message ||
//           "You don't have permission to perform this action";
//         toast.error(forbiddenMsg);
//         break;

//       case 404:
//         console.error("❌ NOT FOUND (404)");
//         const notFoundMsg =
//           errorData?.message || "The requested resource was not found";
//         toast.error(notFoundMsg);
//         break;

//       case 409:
//         console.error("❌ CONFLICT (409)");
//         const conflictMsg =
//           errorData?.message || "A conflict occurred with existing data";
//         toast.error(conflictMsg);
//         break;

//       case 422:
//         console.error("❌ UNPROCESSABLE ENTITY (422)");
//         const validationMsg =
//           errorData?.message || "Validation failed. Please check your input.";
//         toast.error(validationMsg);
//         break;

//       case 500:
//         console.error("❌ SERVER ERROR (500)");
//         const serverErrorMsg =
//           errorData?.message ||
//           "Server encountered an error. Please try again later.";
//         toast.error(serverErrorMsg);
//         break;

//       case 503:
//         console.error("❌ SERVICE UNAVAILABLE (503)");
//         const unavailableMsg =
//           errorData?.message || "Server is temporarily unavailable";
//         toast.error(unavailableMsg);
//         break;

//       default:
//         if (status) {
//           console.error(`❌ HTTP ERROR (${status})`);
//           const defaultMsg =
//             errorData?.message ||
//             errorData?.error ||
//             `Request failed with status ${status}`;
//           toast.error(defaultMsg);
//         }
//     }

//     console.log("========================================");
//     return Promise.reject(error);
//   }
// );

// // Helper function to test backend connection
// export const testBackendConnection = async () => {
//   try {
//     console.log("🧪 Testing backend connection...");
//     const response = await axios.get(`${API_URL}/api/csrf-token`, {
//       timeout: 5000,
//     });
//     console.log("✅ Backend is reachable!");
//     return true;
//   } catch (error) {
//     console.error("❌ Backend connection test failed!");
//     console.error("Error:", error.message);
//     return false;
//   }
// };

// // Log API configuration on module load
// console.log("📡 API Service initialized");
// console.log("📡 Ready to make requests to:", `${API_URL}/api`);

// export default api;
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
  console.error("CRITICAL: REACT_APP_API_URL is not defined!");
  console.error(
    "Please create a .env file with: REACT_APP_API_URL=http://localhost:8080"
  );
  toast.error("Configuration error! API URL is missing.");
}

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("JWT_TOKEN");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Network error
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      console.error("Network error: Backend is not reachable at", API_URL);
      toast.error(
        "Cannot connect to server. Please check if backend is running."
      );
      return Promise.reject(error);
    }

    // Timeout error
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout");
      toast.error("Request timed out. Please try again.");
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url;
    const errorData = error.response?.data;

    // Handle 401 Unauthorized
    if (status === 401) {
      const hasToken = localStorage.getItem("JWT_TOKEN");

      // Login/signup errors - never logout
      if (
        url?.includes("/signin") ||
        url?.includes("/login") ||
        url?.includes("/signup")
      ) {
        const message = errorData?.message || "Invalid credentials";
        toast.error(message);
        return Promise.reject(error);
      }

      // 2FA errors - never logout
      if (url?.includes("/verify-2fa") || url?.includes("/2fa")) {
        const message = errorData?.message || "Invalid verification code";
        toast.error(message);
        return Promise.reject(error);
      }

      // Token expired on protected routes
      if (hasToken && !originalRequest._retry) {
        const errorMsg = errorData?.message?.toLowerCase() || "";
        const isTokenError =
          errorMsg.includes("token") ||
          errorMsg.includes("expired") ||
          errorMsg.includes("jwt") ||
          errorMsg.includes("unauthorized");

        if (isTokenError) {
          console.error("Token expired - logging out");
          originalRequest._retry = true;
          toast.error("Your session has expired. Please login again.");

          localStorage.clear();

          setTimeout(() => {
            window.location.href = "/login";
          }, 1500);

          return Promise.reject(error);
        }
      }

      // Generic 401
      const message = errorData?.message || "Authentication required";
      toast.error(message);
      return Promise.reject(error);
    }

    // Handle other status codes
    const errorMessages = {
      400: errorData?.message || "Invalid request data",
      403: errorData?.message || "You don't have permission for this action",
      404: errorData?.message || "Resource not found",
      409: errorData?.message || "Conflict with existing data",
      422: errorData?.message || "Validation failed",
      500: errorData?.message || "Server error. Please try again later",
      503: errorData?.message || "Service temporarily unavailable",
    };

    if (errorMessages[status]) {
      console.error(`HTTP ${status}:`, errorMessages[status]);
      toast.error(errorMessages[status]);
    } else if (status) {
      const defaultMsg =
        errorData?.message || `Request failed with status ${status}`;
      console.error(`HTTP ${status}:`, defaultMsg);
      toast.error(defaultMsg);
    }

    return Promise.reject(error);
  }
);

// Test backend connection
export const testBackendConnection = async () => {
  try {
    await axios.get(`${API_URL}/api/csrf-token`, { timeout: 5000 });
    console.log("Backend connection successful");
    return true;
  } catch (error) {
    console.error("Backend connection failed:", error.message);
    return false;
  }
};

export default api;
