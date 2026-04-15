import { api } from "../lib/api";
import { navigate } from "./navigation";
import { jwtDecode } from 'jwt-decode';

export const login = (data: { email: string; password: string }) => {
  return api.post("/auth", data);
}

export const logout = () => {
  localStorage.removeItem('token');
  navigate("/login");
}

export const getToken = () => {
  return localStorage.getItem('token');
}

export const getTokenInfo = () => {
  const token = getToken();
  if (!token) return null;
  const decoded = jwtDecode(token);
  if (decoded) return decoded;

  return null
}

export const setToken = (token: string) => {
  localStorage.setItem('token', token);
}

export const removeToken = () => {
  localStorage.removeItem('token');
}