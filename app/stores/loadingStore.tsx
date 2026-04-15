let loading = false;

const listeners: Array<(value: boolean) => void> = [];

export const loadingStore = {
  get: () => loading,

  set: (value: boolean) => {
    loading = value;
    listeners.forEach((l) => l(value));
  },

  subscribe: (listener: (value: boolean) => void) => {
    listeners.push(listener);

    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  },
};