// src/lib/auth.ts
import { jwtDecode } from "jwt-decode";

export interface UserPayload {
  id: number;
  name: string;
  email: string;
}

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const isAuthenticated = (): boolean => !!getToken();

export const getUser = (): UserPayload | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<UserPayload>(token);
    return decoded;
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
};
