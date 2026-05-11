import { authStrings } from "../strings";
import { isApiError } from "@/api";

type ErrorMessages = typeof authStrings.register.errors;

/**
 * Map an unknown error (typically from React Query) into a user-facing
 * Spanish message from authStrings.register.errors.
 * Falls back to NETWORK_ERROR for anything we don't recognize.
 */
export function useAuthErrorMessage() {
  return (error: unknown): { code: string; message: string } => {
    if (isApiError(error)) {
      const code = error.code as keyof ErrorMessages;
      const message =
        authStrings.register.errors[code] ?? authStrings.register.errors.NETWORK_ERROR;
      return { code: error.code, message };
    }
    return {
      code: "NETWORK_ERROR",
      message: authStrings.register.errors.NETWORK_ERROR,
    };
  };
}
