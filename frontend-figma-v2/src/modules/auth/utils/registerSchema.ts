import { z } from "zod";
import { authStrings } from "../strings";

const errors = authStrings.register.errors;

export const registerSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, { message: errors.COMPANY_NAME_TOO_SHORT })
    .max(100),
  countryCode: z
    .string()
    .regex(/^[A-Z]{2}$/, { message: errors.INVALID_COUNTRY_CODE }),
  fullName: z
    .string()
    .trim()
    .min(2, { message: errors.FULL_NAME_TOO_SHORT })
    .max(100),
  email: z
    .string()
    .trim()
    .email({ message: errors.INVALID_EMAIL })
    .max(255),
  role: z.enum(["company_admin", "manager", "creator", "auditor"], {
    errorMap: () => ({ message: errors.ROLE_REQUIRED }),
  }),
  password: z
    .string()
    .min(8, { message: errors.PASSWORD_TOO_SHORT })
    .regex(/[A-Z]/, { message: errors.PASSWORD_WEAK })
    .regex(/[a-z]/, { message: errors.PASSWORD_WEAK })
    .regex(/[0-9]/, { message: errors.PASSWORD_WEAK }),
  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: errors.TERMS_NOT_ACCEPTED }),
  }),
});

export type RegisterSchema = typeof registerSchema;
