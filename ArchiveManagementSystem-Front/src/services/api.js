// import axios from "axios";
// import toast from "react-hot-toast";

// console.log("API URL:", process.env.REACT_APP_API_URL);

// // Axios instance
// const api = axios.create({
//   baseURL: `${process.env.REACT_APP_API_URL}/api`,
//   headers: {
//     Accept: "application/json",
//   },
//   withCredentials: true,
// });

// // Request interceptor
// api.interceptors.request.use(
//   async (config) => {
//     const token = localStorage.getItem("JWT_TOKEN");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     let csrfToken = localStorage.getItem("CSRF_TOKEN");
//     if (!csrfToken) {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/api/csrf-token`,
//           { withCredentials: true }
//         );
//         csrfToken = response.data.token;
//         localStorage.setItem("CSRF_TOKEN", csrfToken);
//       } catch (error) {
//         console.error("Failed to fetch CSRF token", error);
//       }
//     }

//     if (csrfToken) {
//       config.headers["X-XSRF-TOKEN"] = csrfToken;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // 🧠 که 401 د verify-2fa API لپاره وي، logout مه کوه
//     if (
//       error.response?.status === 401 &&
//       originalRequest?.url?.includes("/verify-2fa")
//     ) {
//       return Promise.reject(error); // یواځې خطا بېرته ورکړه، نه redirect
//     }

//     // نور عادي 401 حالتونه – لکه session expiry
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refreshResponse = await axios.post(
//           `${process.env.REACT_APP_API_URL}/api/refresh-token`,
//           {},
//           { withCredentials: true }
//         );

//         const newToken = refreshResponse.data.accessToken;
//         if (newToken) {
//           localStorage.setItem("JWT_TOKEN", newToken);
//           toast.success("Session refreshed");

//           originalRequest.headers.Authorization = `Bearer ${newToken}`;
//           return api(originalRequest);
//         }
//       } catch (refreshError) {
//         console.error("Token refresh failed", refreshError);
//         toast.error("Session expired, please login again");

//         localStorage.clear();
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
import axios from "axios";
import toast from "react-hot-toast";

console.log("API URL:", process.env.REACT_APP_API_URL);

// Axios instance
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    console.log("🚀 REQUEST:", config.method.toUpperCase(), config.url);

    const token = localStorage.getItem("JWT_TOKEN");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 JWT Token attached");
    } else {
      console.log("⚠️ No JWT Token found");
    }

    let csrfToken = localStorage.getItem("CSRF_TOKEN");
    if (!csrfToken) {
      console.log("⚠️ No CSRF Token in localStorage, fetching...");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/csrf-token`,
          { withCredentials: true }
        );
        csrfToken = response.data.token;
        localStorage.setItem("CSRF_TOKEN", csrfToken);
        console.log("✅ CSRF Token fetched and stored");
      } catch (error) {
        console.error("❌ Failed to fetch CSRF token", error);
      }
    } else {
      console.log("✅ CSRF Token found in localStorage");
    }

    if (csrfToken) {
      config.headers["X-XSRF-TOKEN"] = csrfToken;
    }

    return config;
  },
  (error) => {
    console.error("❌ Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log("✅ RESPONSE SUCCESS:", response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.log("🔴 RESPONSE ERROR INTERCEPTOR TRIGGERED");
    console.log("🔴 Error Status:", error.response?.status);
    console.log("🔴 Error URL:", error.config?.url);
    console.log("🔴 Error Data:", error.response?.data);

    const originalRequest = error.config;

    // 🧠 که 401 د verify-2fa API لپاره وي، logout مه کوه
    if (
      error.response?.status === 401 &&
      originalRequest?.url?.includes("/verify-2fa")
    ) {
      console.log("⚠️ 401 on verify-2fa - not logging out");
      return Promise.reject(error);
    }

    // نور عادي 401 حالتونه – لکه session expiry
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("🔄 Attempting token refresh...");
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newToken = refreshResponse.data.accessToken;
        if (newToken) {
          localStorage.setItem("JWT_TOKEN", newToken);
          toast.success("Session refreshed");
          console.log("✅ Token refreshed successfully");

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);
        toast.error("Session expired, please login again");
        localStorage.clear();
        console.log("🚪 Redirecting to login...");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Handle 419 CSRF token mismatch
    if (error.response?.status === 419) {
      console.log("⚠️ CSRF Token Mismatch - clearing and retrying");
      localStorage.removeItem("CSRF_TOKEN");
      toast.error("Security token expired. Please try again.");
    }

    return Promise.reject(error);
  }
);

export default api;
