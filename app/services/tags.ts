import { api } from "~/lib/api";

export const getTags = async () => {
    return api.get("/tags");
}

export const addTag = async (name: string, color: string) => {
    return api.post("/tags/add", { name, color });
}

export const editTag = async (id: number, name: string, color: string) => {
    return api.put("/tags/edit", { id, name, color });
}

export const deleteTag = async (id: number) => {
    return api.delete(`/tags/${id}`);
}