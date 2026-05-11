import type { RegisterFormValues } from "../components/RegisterForm/RegisterForm.types";

const MAP: Record<string, keyof RegisterFormValues> = {
  EMAIL_ALREADY_EXISTS: "email",
  INVALID_EMAIL: "email",
  PASSWORD_TOO_SHORT: "password",
  INVALID_COUNTRY_CODE: "countryCode",
  TERMS_NOT_ACCEPTED: "acceptedTerms",
};

export function mapApiErrorToField(code: string): keyof RegisterFormValues | null {
  return MAP[code] ?? null;
}
