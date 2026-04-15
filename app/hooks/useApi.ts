"use client";
import { useState } from "react";
import { appToast } from "~/lib/toast";
import { useLoading } from "./useLoading";

export function useApi<T = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setLoadingScreen } = useLoading();


  const request = async (fn: () => Promise<any>, toastError = true, isLoadingScreen = true): Promise<T> => {
    try {
      setLoading(true);
      if (isLoadingScreen) setLoadingScreen(true);
      setError(null);

      const response = await fn();
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Unexpected error';

      setError(message);
      if (toastError) appToast.error(message);
      throw err;
    } finally {
      if (isLoadingScreen) setLoadingScreen(false);
      setLoading(false);
    }
  }

  return {
    request,
    loading,
    error,
  };
}