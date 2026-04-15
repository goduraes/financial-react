import { toast } from "sonner";

const action = {
  label: "Fechar",
  onClick: () => null,
}

export const appToast = {
  success: (message: string) => {
    toast.success(message, {
      style: { background: "#16a34a" },
      actionButtonStyle: { background: "#22c55e", color: "#fff" },
      action,
    });
  },

  error: (message: string) => {
    toast.error(message, {
      style: { background: "#dc2626" },
      actionButtonStyle: { background: "#ef4444", color: "#fff" },
      action,
    });
  },

  warning: (message: string) => {
    toast.warning(message);
  },

  info: (message: string) => {
    toast.info(message);
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  promise: toast.promise,
};