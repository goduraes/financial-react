import { useEffect, useState } from "react";
import { loadingStore } from "~/stores/loadingStore";

export const useLoading = () => {
  const [loadingScreen, setLoadingScreen] = useState(loadingStore.get());

  useEffect(() => {
    const unsubscribe = loadingStore.subscribe(setLoadingScreen);
    return unsubscribe;
  }, []);

  return {
    loadingScreen,
    setLoadingScreen: loadingStore.set,
  };
};