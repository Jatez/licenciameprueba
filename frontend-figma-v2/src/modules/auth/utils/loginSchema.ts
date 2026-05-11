import { z } from "zod";
import { authStrings } from "../strings";

const e = authStrings.login.errors;

export const loginSchema = z.object({
  email: z.string().trim().email({ message: e.INVALID_EMAIL }).max(255),
  password: z.string().min(1, { message: e.PASSWORD_REQUIRED }).max(255),
  remember: z.boolean().optional().default(false),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email({ message: e.INVALID_EMAIL }).max(255),
});
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
