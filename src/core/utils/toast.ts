// ==============================================================================
// core/utils/toast.ts
// Centralized Toast notification system using Sonner
// Encapsulates toast rendering and automatic error formatting
// ==============================================================================
import { toast as sonnerToast } from "sonner";
import { getFriendlyErrorMessage } from "./error";

export const toast = {
  /** Display a success toast message */
  success(message: string, description?: string) {
    return sonnerToast.success(message, {
      description,
      duration: 4000,
    });
  },

  /** Display an error toast with user-friendly formatting */
  error(error: unknown, fallbackMessage?: string) {
    const userMessage = getFriendlyErrorMessage(error, "ToastNotification");
    return sonnerToast.error(fallbackMessage ?? "Operation Failed", {
      description: userMessage,
      duration: 5000,
    });
  },

  /** Display an informational toast */
  info(message: string, description?: string) {
    return sonnerToast.info(message, {
      description,
      duration: 4000,
    });
  },

  /** Display a warning toast */
  warning(message: string, description?: string) {
    return sonnerToast.warning(message, {
      description,
      duration: 4500,
    });
  },

  /** Wrap an async promise with pending, success, and error toast states */
  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: unknown) => string);
    }
  ) {
    return sonnerToast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: (err) => {
        if (typeof messages.error === "function") {
          return messages.error(err);
        }
        return getFriendlyErrorMessage(err, "ToastPromise");
      },
    });
  },

  /** Dismiss a specific toast or all toasts */
  dismiss(toastId?: string | number) {
    sonnerToast.dismiss(toastId);
  },
};
