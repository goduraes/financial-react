"use client";
import { useState } from "react";

export function useApi<T = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function request(fn: () => Promise<any>): Promise<T> {
    try {
      setLoading(true);
      setError(null);

      const response = await fn();
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Erro inesperado";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    request,
    loading,
    error,
  };
}