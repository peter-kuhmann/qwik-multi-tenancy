import { createSession, deleteSession } from "~/db/models/sessions";
import type { TargetUser } from "~/db/models/users";
import type { Session } from "@prisma/client";
import {
  computeIdleExpiresAtDate,
  computeMaxExpiresAtDate,
  generateSessionId,
} from "~/logic/sessions/utils";

export async function createNewSessionForUser(
  target: TargetUser,
  maxExpiresAt?: Date
) {
  return createSession({
    sessionId: generateSessionId(),
    userId: target.userId,
    tenantId: target.tenantId,
    idleExpiresAt: computeIdleExpiresAtDate(),
    maxExpiresAt: maxExpiresAt ?? computeMaxExpiresAtDate(),
  });
}

export async function replaceSession(oldSession: Session) {
  await deleteSession({
    sessionId: oldSession.sessionId,
    tenantId: oldSession.tenantId,
  });

  return createNewSessionForUser(
    {
      tenantId: oldSession.tenantId,
      userId: oldSession.userId,
    },
    oldSession.maxExpiresAt
  );
}
