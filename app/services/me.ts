import { api } from "~/lib/api";

export const getMe = async () => {
    return api.get("/me");
}

export const editMe = (name: string, email: string) => {
    return api.patch("/me/edit", { name, email });
}

export const editPasswordMe = (currentPassword: string, newPassword: string) => {
    return api.patch("/me/edit-password", { currentPassword, newPassword });
}