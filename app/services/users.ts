import { api } from "~/lib/api";

export const getUsers = () => {
    return api.get(`/users`);
}

export const getUserById = (id: number) => {
    return api.get(`/users/${id}`);
}