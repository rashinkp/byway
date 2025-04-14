import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api/v1",
  withCredentials: true,
});

export async function login(email: string, password: string) {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data.data; // { id, email, role }
  } catch (error) {
    throw new Error(
      (error as AxiosError).response?.data as string || "Login failed"
    );
  }
}

export async function signup(name: string, email: string, password: string) {
  try {
    const response = await api.post("/auth/signup", { name, email, password });
    return response.data.data; 
  } catch (error) {
    throw new Error(
      (error as AxiosError).response?.data as string || "Signup failed"
    );
  }
}

export async function verifyAuth() {
  try {
    const response = await api.get("/auth/me");
    return response.data.data; 
  } catch {
    throw new Error("Invalid session");
  }
}

export async function logout() {
  await api.post("/auth/logout");
}
