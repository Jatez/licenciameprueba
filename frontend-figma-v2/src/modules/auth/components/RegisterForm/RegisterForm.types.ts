import type { z } from "zod";
import type { registerSchema } from "../../utils/registerSchema";

export type RegisterFormValues = z.infer<typeof registerSchema>;
