import JwtManager from "~/crypto/JwtManager";
import { Env } from "~/env";
import { z } from "zod";

export default new JwtManager({
  algorithm: Env.AUTH_FLOW_JWT_ALGORITHM,
  privateKey: Env.AUTH_FLOW_JWT_PRIVATE_KEY,
  publicKey: Env.AUTH_FLOW_JWT_PUBLIC_KEY,
  issuer: Env.AUTH_FLOW_JWT_ISSUER,
  audience: Env.AUTH_FLOW_JWT_AUDIENCE,
  defaultExpiresInSeconds: Env.AUTH_FLOW_JWT_EXPIRES_IN_SECONDS,
  payloadSchema: z.discriminatedUnion("type", [
    z.object({
      type: z.literal("signUpRequest"),
      tenantId: z.string().nonempty(),
      name: z.string().nonempty(),
      email: z.string().email(),
    }),
    z.object({
      type: z.literal("loginRequest"),
      tenantId: z.string().nonempty(),
      email: z.string().email(),
    }),
  ]),
});
