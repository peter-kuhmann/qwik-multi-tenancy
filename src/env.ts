import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  BASE_HOSTNAME: z.string().min(1),
});

export const Env = EnvSchema.parse(process.env);
