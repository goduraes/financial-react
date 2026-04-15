import { api } from "~/lib/api";

export const getMe = async () => {
    return api.get("/me");
}

export const editMe = (name: string, email: string) => {
    return api.put("/me/edit", { name, email });
}