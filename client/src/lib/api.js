import { useAuthStore } from "@/features/auth/store";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_SERVER_URL;

const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

// Routes where refresh-token logic should NOT run
const excludedRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/send-otp",
  "/auth/verify-otp",
  "/auth/logout",
  "/auth/refresh-token",
  "/auth/google",
];

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Handle Token Expiration
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Prevent crashes if response doesn't exist
    if (!error.response) {
      return Promise.reject(error);
    }

    // Check whether current route should skip refresh logic
    const shouldSkipRefresh = excludedRoutes.some((route) =>
      originalRequest.url?.includes(route),
    );

    // if 401 and not retried and not excluded routes
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !shouldSkipRefresh
    ) {
      originalRequest._retry = true;

      try {
        // Request new access token using HttpOnly refresh token cookie
        const res = await axios.post(
          "http://localhost:5000/api/auth/refresh-token",
          {},
          { withCredentials: true },
        );

        const newAccessToken = res.data.newAccessToken;

        // Update Zustand auth state
        useAuthStore.getState().setAccessToken(newAccessToken);

        // Attach new token to failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token invalid/expired → logout user
        await useAuthStore.getState().logout();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
