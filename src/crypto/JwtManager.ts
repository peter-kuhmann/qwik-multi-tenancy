import type { ZodType } from "zod";
import { z } from "zod";
import jsonwebtoken from "jsonwebtoken";

export const JwtManagerSupportedAlgorithmSchema = z.enum(["ES256"]);

export type JwtManagerSupportedAlgorithm = z.infer<
  typeof JwtManagerSupportedAlgorithmSchema
>;

export type JwtManagerProps<PAYLOAD_SCHEMA extends ZodType> = {
  payloadSchema: PAYLOAD_SCHEMA;
  defaultExpiresInSeconds: number;
  issuer: string;
  audience: string | string[];
  algorithm: JwtManagerSupportedAlgorithm;
  privateKey: string;
  publicKey: string;
};

export default class JwtManager<PAYLOAD_SCHEMA extends ZodType> {
  constructor(private readonly options: JwtManagerProps<PAYLOAD_SCHEMA>) {}

  createSignedJwt(payload: z.infer<PAYLOAD_SCHEMA>): string {
    return jsonwebtoken.sign(
      this.options.payloadSchema.parse(payload),
      this.options.privateKey,
      {
        algorithm: this.options.algorithm,
        expiresIn: this.options.defaultExpiresInSeconds,
        issuer: this.options.issuer,
        audience: this.options.audience,
      }
    );
  }

  validateAndParseJwt(jwt: string): z.infer<PAYLOAD_SCHEMA> {
    const validateAndParseResult = this.safeValidateAndParseJwt(jwt);

    if (!validateAndParseResult.success) {
      throw new Error(
        `Validation and/or parsing of JWT failed. Reason: ${
          validateAndParseResult.reason
        }. Message: ${validateAndParseResult.message ?? "--no-message--"}`
      );
    }

    return validateAndParseResult.payload;
  }

  safeValidateAndParseJwt(jwt: string):
    | {
        success: false;
        reason:
          | "jwtExpired"
          | "jwtNotBeforeError"
          | "jwtInvalid"
          | "payloadInvalid"
          | "unknown";
        message: string;
      }
    | { success: true; payload: z.infer<PAYLOAD_SCHEMA> } {
    try {
      const { payload } = jsonwebtoken.verify(jwt, this.options.publicKey, {
        complete: true,
        algorithms: [this.options.algorithm],
        issuer: this.options.issuer,
        audience: this.options.audience,
      });

      const parseResult = this.options.payloadSchema.safeParse(payload);

      if (!parseResult.success) {
        return {
          success: false,
          reason: "payloadInvalid",
          message: parseResult.error.message,
        };
      }

      return {
        success: true,
        payload: parseResult.data,
      };
    } catch (e: any) {
      if (e?.name === "NotBeforeError") {
        return {
          success: false,
          reason: "jwtNotBeforeError",
          message: e.message,
        };
      }

      if (e?.name === "TokenExpiredError") {
        return {
          success: false,
          reason: "jwtExpired",
          message: e.message,
        };
      }

      if (e?.name === "JsonWebTokenError") {
        return {
          success: false,
          reason: "jwtInvalid",
          message: e.message,
        };
      }

      return {
        success: false,
        reason: "unknown",
        message: e?.message ?? "--no-message--",
      };
    }
  }
}
