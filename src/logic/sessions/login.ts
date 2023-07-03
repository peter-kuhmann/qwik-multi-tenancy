import type { Cookie } from "@builder.io/qwik-city";
import { createNewSessionForUser } from "~/logic/sessions/create";
import { putSessionIdAsCookie } from "~/logic/sessions/cookie";
import type { TargetUser } from "~/db/models/users";

export async function logUserIn(targetUser: TargetUser, cookie: Cookie) {
  const newSession = await createNewSessionForUser(targetUser);
  putSessionIdAsCookie(newSession.sessionId, cookie);
}
