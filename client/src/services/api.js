import axios from "axios";

function getApiBaseUrl() {
  const apiUrl = import.meta.env.VITE_API_URL?.trim();

  if (!apiUrl) return "/api";

  const normalizedUrl = apiUrl.replace(/\/$/, "");
  return normalizedUrl.endsWith("/api") ? normalizedUrl : `${normalizedUrl}/api`;
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("financeflow_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

export default api;
