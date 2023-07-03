import { generate } from "randomstring";
import { Env } from "~/env";
import type { Session } from "@prisma/client";

export function generateSessionId() {
  return generate({ length: 128, charset: "alphanumeric" });
}

export function computeIdleExpiresAtDate(nowEpochMilliseconds?: number) {
  return new Date(
    (nowEpochMilliseconds ?? Date.now()) +
      Env.SESSIONS_IDLE_EXPIRES_IN_SECONDS * 1000
  );
}

export function computeMaxExpiresAtDate(nowEpochMilliseconds?: number) {
  return new Date(
    (nowEpochMilliseconds ?? Date.now()) +
      Env.SESSIONS_MAX_EXPIRES_IN_SECONDS * 1000
  );
}

export function isSessionExpired(session: Session) {
  const now = Date.now();
  return (
    now > session.idleExpiresAt.getTime() ||
    now > session.maxExpiresAt.getTime()
  );
}
