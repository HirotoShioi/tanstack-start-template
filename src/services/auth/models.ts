import type { userSchema } from "better-auth";
import type z from "zod";

export type User = z.infer<typeof userSchema>;
