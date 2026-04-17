import { editTag } from '~/services/tags';
import { api } from "~/lib/api";

export const getTransactions = async () => {
    return api.get("/transactions");
}

export const addTransactions = (data: any) => {
    return api.post("/transactions/add", data);
}

export const editTagTransactions = (data: any) => {
    return api.put("/transactions/add", data);
}