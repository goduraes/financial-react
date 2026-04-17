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

export const changeRoleUser = (id: number, role: string) => {
    return api.patch(`/users/change-role/${id}`, { role });
}

export const toggleUserStatus = (id: number, is_active: boolean) => {
    return api.patch(`/users/toggle-status/${id}`, { is_active });
}