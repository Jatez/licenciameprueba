import type { ApiError, AuthErrorCode } from "./types";

/** Type guard so React Query error handlers can narrow safely. */
export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    "message" in value &&
    typeof (value as { code: unknown }).code === "string" &&
    typeof (value as { message: unknown }).message === "string"
  );
}

/** Build and throw an ApiError. Kept for compatibility with any remaining callers. */
export function mockError(code: AuthErrorCode | string, message: string, field?: string): never {
  const error: ApiError = field ? { code, message, field } : { code, message };
  throw error;
}

/** @deprecated Only kept so existing imports don't break during migration. */
export function mockDelay(): Promise<void> {
  return Promise.resolve();
}
