import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

http.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const url = error.config?.url ?? "";
    const isAuthRequest =
      url.includes("/auth/login") || url.includes("/auth/me");

    if (status === 401 && !isAuthRequest) {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    return Promise.reject(error);
  },
);
