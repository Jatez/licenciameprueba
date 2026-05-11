import { useCallback, useState } from "react";
import type { UseFormSetError, FieldValues, Path } from "react-hook-form";
import { isApiError } from "@/api";

/**
 * Bridge backend ApiError → react-hook-form field errors + a residual
 * top-level message for non-field errors. Use in mutation `onError`:
 *
 *   const { formError, applyError, clearFormError } = useFormErrors(setError);
 *   onError: (e) => applyError(e)
 */
export function useFormErrors<TForm extends FieldValues>(
  setError?: UseFormSetError<TForm>,
) {
  const [formError, setFormError] = useState<string | null>(null);

  const applyError = useCallback(
    (err: unknown) => {
      if (isApiError(err)) {
        if (err.field && setError) {
          setError(err.field as Path<TForm>, { type: "server", message: err.message });
          setFormError(null);
          return;
        }
        setFormError(err.message);
        return;
      }
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        (err as { message?: string })?.message ??
        "Ocurrió un error. Intenta de nuevo.";
      setFormError(message);
    },
    [setError],
  );

  const clearFormError = useCallback(() => setFormError(null), []);

  return { formError, applyError, clearFormError };
}