import axios from "axios";
import config from "./config";
import { AUTH_TOKENS_KEY } from "./constants";
const API = axios.create({
  baseURL: config.BASE_URL,
  headers: {
    "x-api-key": config.API_KEY,
  },
});

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

API.interceptors.request.use((req) => {
  if (localStorage.getItem("tokens")) {
    const tokens = localStorage.getItem("tokens");
    if (tokens) {
      const access = JSON.parse(tokens).access;
      if (access) {
        req.headers.Authorization = `Bearer ${access}`;
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
    if (error.response.status === 401) {
      try {
        // Call a function to refresh the token
        const newToken = await refreshAuthToken();
        error.config.headers["Authorization"] = `Bearer ${newToken}`;
        // Retry the original request with the new token
        return axios(error.config);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Optionally redirect to login
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
