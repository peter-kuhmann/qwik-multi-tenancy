import type { TargetSession } from "~/db/models/sessions";
import { deleteSession } from "~/db/models/sessions";
import type { Cookie } from "@builder.io/qwik-city";
import { deleteSessionIdCookie } from "~/logic/sessions/cookie";
import { SessionCache } from "~/logic/sessions/cache";

export async function logUserOut(targetSession: TargetSession, cookie: Cookie) {
  deleteSessionIdCookie(cookie);
  await deleteSession(targetSession);
  SessionCache.delete(targetSession.sessionId);
}
