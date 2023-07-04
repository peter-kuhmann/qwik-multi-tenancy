import { z } from "zod";
import { JwtManagerSupportedAlgorithmSchema } from "~/crypto/JwtManager";

const EnvBooleanSchema = z
  .enum(["true", "false", "TRUE", "FALSE"])
  .transform((value) => value.toLowerCase() === "true");

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  BASE_HOSTNAME: z.string().min(1),

  EMAIL_SMTP_PORT: z.coerce.number().positive(),
  EMAIL_SMTP_HOST: z.string().nonempty(),
  EMAIL_SMTP_SECURE: EnvBooleanSchema,
  EMAIL_SMTP_USERNAME: z.string().nonempty(),
  EMAIL_SMTP_PASSWORD: z.string().nonempty(),
  EMAIL_SMTP_FROM: z.string().nonempty(),

  TENANTS_CACHE_MAX_ENTRIES: z.coerce.number().min(0).optional().default(5000),
  TENANTS_CACHE_TTL_SECONDS: z.coerce
    .number()
    .min(0)
    .max(120)
    .optional()
    .default(30),

  SESSIONS_IDLE_EXPIRES_IN_SECONDS: z.coerce
    .number()
    .min(0)
    .max(2 * 60 * 60)
    .optional()
    .default(1 * 60 * 60), // max 2hrs, default 1hr
  SESSIONS_MAX_EXPIRES_IN_SECONDS: z.coerce
    .number()
    .min(0)
    .max(7 * 24 * 60 * 60)
    .optional()
    .default(3 * 24 * 60 * 60), // max 7days, default 3days
  SESSIONS_CACHE_MAX_ENTRIES: z.coerce.number().min(0).optional().default(5000),
  SESSIONS_CACHE_TTL_SECONDS: z.coerce
    .number()
    .min(0)
    .max(30)
    .optional()
    .default(5),

  AUTH_FLOW_JWT_ALGORITHM: JwtManagerSupportedAlgorithmSchema,
  AUTH_FLOW_JWT_EXPIRES_IN_SECONDS: z.coerce
    .number()
    .min(0)
    .max(3600)
    .optional()
    .default(300), // max 1hr, default 5mins
  AUTH_FLOW_JWT_ISSUER: z.string().min(1),
  AUTH_FLOW_JWT_AUDIENCE: z.string().min(1),
  AUTH_FLOW_JWT_PRIVATE_KEY: z
    .string()
    .min(1)
    .transform((value) => value.replace(/\\n/g, "\n")),
  AUTH_FLOW_JWT_PUBLIC_KEY: z
    .string()
    .min(1)
    .transform((value) => value.replace(/\\n/g, "\n")),
});

export const Env = EnvSchema.parse(process.env);
