
import { toast as sonnerToast } from "sonner";

type ToastType = {
  message: string;
  description?: string;
};

export const toast = {
  error: ({ message, description }: ToastType) => {
    return sonnerToast.error(message, {
      description,
    });
  },
  success: ({ message, description }: ToastType) => {
    return sonnerToast.success(message, {
      description,
    });
  },
  info: ({ message, description }: ToastType) => {
    return sonnerToast.info(message, {
      description,
    });
  },
  warning: ({ message, description }: ToastType) => {
    return sonnerToast.warning(message, {
      description,
    });
  },
};

export const useToast = () => {
  return {
    toast,
  };
};
