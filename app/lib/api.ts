import axios from "axios";
import { getToken, logout, removeToken } from "~/services/auth";

export const api = axios.create({
  baseURL: "https://financial-api-fz04.onrender.com/",
});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            removeToken();
            logout();
        }

        return Promise.reject(error);
    }
);