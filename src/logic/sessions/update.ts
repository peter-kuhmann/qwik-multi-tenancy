import type { TargetSession } from "~/db/models/sessions";
import { updateSession } from "~/db/models/sessions";
import { computeIdleExpiresAtDate } from "~/logic/sessions/utils";

export async function updateSessionIdleExpiresAt(target: TargetSession) {
  return updateSession(target, {
    idleExpiresAt: computeIdleExpiresAtDate(),
  });
}
