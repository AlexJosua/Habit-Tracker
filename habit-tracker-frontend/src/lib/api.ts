import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    (config.headers as any)["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
