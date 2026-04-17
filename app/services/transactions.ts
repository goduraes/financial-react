import { api } from "~/lib/api";

export type getTransactionsFilter = {
    page?: number;
    perPage?: number;
    search: string;
    tags: string[];
    type: '' | "INCOME" | "EXPENSE";
    startDate: string;
    endDate: string;
}

export const getTransactions = async ({
    page, 
    perPage,
    search,
    tags,
    type,
    startDate,
    endDate,
}: getTransactionsFilter) => {
    return api.get(`/transactions?page=${page}&perPage=${perPage}&search=${search}&tags=${tags.join(",")}&type=${type}&startDate=${startDate}&endDate=${endDate}`);
}

export const addTransactions = (data: any) => {
    return api.post("/transactions/add", data);
}

export const editTransactions = (data: any) => {
    return api.put("/transactions/edit", data);
}

export const deleteTransactions = async (id: number) => {
    return api.delete(`/transactions/${id}`);
}