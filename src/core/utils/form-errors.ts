// ==============================================================================
// core/utils/form-errors.ts
// Maps API field errors to React Hook Form fields dynamically
// ==============================================================================
import type { UseFormSetError, FieldValues, Path } from "react-hook-form";
import { ValidationError, toAppError } from "./error";
import { toast } from "./toast";

/**
 * Handles form submission errors:
 * - If error is a ValidationError with fieldErrors, binds errors to RHF fields.
 * - Otherwise displays a friendly toast notification.
 */
export function handleFormError<TFieldValues extends FieldValues>(
  error: unknown,
  setError?: UseFormSetError<TFieldValues>
): void {
  const appError = toAppError(error);

  if (appError instanceof ValidationError && appError.fieldErrors && setError) {
    Object.entries(appError.fieldErrors).forEach(([field, messages]) => {
      setError(field as Path<TFieldValues>, {
        type: "server",
        message: messages[0] ?? "Invalid field value",
      });
    });
    toast.error(appError.userMessage, "Validation Error");
    return;
  }

  toast.error(appError);
}
