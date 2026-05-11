import { z } from "zod";
import { isCorporateEmail } from "@/modules/auth/utils/isCorporateEmail";
import { accessStrings } from "../strings";

const e = accessStrings.invite.errors;

export const inviteUserSchema = z.object({
  email: z
    .string()
    .min(1, e.emailRequired)
    .email(e.emailInvalid)
    .refine((v) => !v.toLowerCase().endsWith("@blocked.com"), e.emailBlocked)
    .refine((v) => isCorporateEmail(v), e.emailPersonal),
  fullName: z.string().trim().min(2, e.nameRequired),
  company: z.string().min(1, e.companyRequired),
  role: z.enum(["empresa_admin", "empresa_user", "super_admin"]),
  language: z.enum(["es", "en"]),
  forceMfa: z.boolean(),
});

export type InviteUserFormValues = z.infer<typeof inviteUserSchema>;
