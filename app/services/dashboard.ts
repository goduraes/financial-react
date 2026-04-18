import { api } from "~/lib/api";

export const getSummary = async (startDate: string, endDate?: string) => {
    return api.get(`/dashboard/summary?startDate=${startDate}&endDate=${endDate}`);
}
