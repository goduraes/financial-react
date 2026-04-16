import { api } from "~/lib/api";

export const getUsers = (page: number, perPage: number, search: string) => {
    return api.get(`/users?page=${page}&perPage=${perPage}&search=${search}`);
}

export const getUserById = (id: number) => {
    return api.get(`/users/${id}`);
}

export const registerUser = (data: { name: string, email: string, password: string }) => {
    return api.post(`/users/add`, data);
}