import axios from "axios";

// Initialize axios instance
const api = axios.create({
  baseURL: "http://localhost:3000/user",
});

// Helper functions to get tokens
const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");

// Set up request interceptor to add Authorization header
api.interceptors.request.use(async (config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Set up response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token is expired, attempt refresh
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Mark request as retried
      const refreshToken = getRefreshToken();

      try {
        // Request new access token using refresh token
        const response = await axios.post(
          "http://localhost:3000/user/refresh-token",
          { refreshToken }
        );

        if (response.status === 200) {
          const newAccessToken = response.data.accessToken;

          // Update local storage and retry original request
          localStorage.setItem("accessToken", newAccessToken);
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        localStorage.removeItem("accessToken"); // Clear invalid tokens
        localStorage.removeItem("refreshToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
