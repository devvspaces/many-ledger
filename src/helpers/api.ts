import axios from "axios";
import config from "./config";
import { AUTH_TOKENS_KEY } from "./constants";

const API = axios.create({
  baseURL: config.BASE_URL,
  headers: {
    "x-api-key": config.API_KEY,
  },
});

let isRefreshing = false;

const refreshAuthToken = async () => {
  const tokens = localStorage.getItem("tokens");
  if (tokens) {
    const jTokens = JSON.parse(tokens);
    const refresh = jTokens.refresh;
    if (refresh) {
      const response = await API.post("/account/token/refresh/", {
        refresh,
      });
      const newToken = response.data.access;
      localStorage.setItem(
        AUTH_TOKENS_KEY,
        JSON.stringify({
          ...jTokens,
          ...response.data,
        })
      );
      return newToken;
    }
  }
  throw new Error("No refresh token found");
};

const handleLogout = () => {
  // Clear tokens from localStorage
  localStorage.removeItem("tokens");
  localStorage.removeItem("user");

  // Redirect to login page
  // Adjust the path as needed for your routing
  window.location.href = "/login";
};

API.interceptors.request.use((req) => {
  if (localStorage.getItem("tokens")) {
    const tokens = localStorage.getItem("tokens");
    if (tokens) {
      try {
        const access = JSON.parse(tokens).access;
        if (access) {
          req.headers.Authorization = `Bearer ${access}`;
        }
      } catch {
        // Clear tokens from localStorage
        localStorage.removeItem("tokens");
        localStorage.removeItem("user");
      }
    }
  }
  return req;
});

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Only attempt to refresh if it's a 401 error and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent multiple simultaneous refresh attempts
      if (isRefreshing) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        const newToken = await refreshAuthToken();

        // Update the original request with the new token
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        // Reset the refreshing flag
        isRefreshing = false;

        // Retry the original request
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout the user
        isRefreshing = false;
        handleLogout();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
