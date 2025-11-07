// src/api/client.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:6789";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { "Content-Type": "application/json" },
});

// Attach token from localStorage to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
