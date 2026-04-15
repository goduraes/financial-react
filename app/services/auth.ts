import { api } from "../lib/api";

export const login = (data: { email: string; password: string }) => {
  return api.post("/auth", data);
}