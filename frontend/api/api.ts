// src/api/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:5001/api/v1",
  withCredentials: true,
  headers: {
    "Cache-Control": "no-cache",
  },
});

api.interceptors.request.use((config) => {
  console.log("Request:", config.method, config.url);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("Response error:", error.response?.status, error.message);
    return Promise.reject(error);
  }
);
