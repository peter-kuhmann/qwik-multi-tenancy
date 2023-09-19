import type { Session } from "@prisma/client";
import type { TargetSession } from "~/db/models/sessions";
import { deleteSession, fetchSession } from "~/db/models/sessions";
import { replaceSession } from "~/logic/sessions/create";
import { isSessionExpired } from "~/logic/sessions/utils";
import {
  deleteSessionIdCookie,
  getSessionIdFromCookie,
  putSessionIdAsCookie,
} from "~/logic/sessions/cookie";
import type { Cookie } from "@builder.io/qwik-city";
import { fetchUser } from "~/db/models/users";
import { updateSessionIdleExpiresAt } from "~/logic/sessions/update";
import type { ResolvedSession } from "~/logic/sessions/types";
import { SessionCache } from "~/logic/sessions/cache";
import { PermissionAssignmentSchema } from "~/logic/permissions/PermissionAssignment";

export async function getSessionFromCookieAndTenantId(
  cookie: Cookie,
  tenantId: string
): Promise<ResolvedSession | null> {
  const sessionId = getSessionIdFromCookie(cookie);
  if (!sessionId) return null;

  const sessionResult =
    await getSessionWithCacheAndHandleInvalidationAndReplacement({
      sessionId,
      tenantId,
    });

  if (!sessionResult.found || sessionResult.invalidated) {
    // Regarding "not found" case: By deleting the cookie when the session was not found, we can reduce
    // cache queries and DB queries, as the first check "if (!sessionId)" will quit early.
    deleteSessionIdCookie(cookie);
    return null;
  }

  if (sessionResult.replaced) {
    putSessionIdAsCookie(sessionResult.session.sessionId, cookie);
  }

  return sessionResult.session;
}

async function getSessionWithCacheAndHandleInvalidationAndReplacement(
  target: TargetSession
): Promise<
  | { found: false }
  | { found: true; invalidated: true }
  | {
      found: true;
      invalidated: false;
      session: ResolvedSession;
      replaced: boolean;
    }
> {
  // Use cache first
  const cacheEntry = SessionCache.get(target.sessionId);
  if (cacheEntry) {
    return cacheEntry.found
      ? {
          found: true,
          session: cacheEntry.resolvedSession,
          invalidated: false,
          replaced: false,
        }
      : { found: false };
  }

  // Now we handle sessions fetched from DB
  let session: Session | null = await fetchSession(target);

  if (!session) {
    SessionCache.set(target.sessionId, { found: false });
    return { found: false };
  }

  // Check expiration
  if (isSessionExpired(session)) {
    await deleteSession(target);
    return { found: true, invalidated: true };
  }

  // Replace if necessary (mainly used when changing authorization levels)
  // replaced === true means new session ID
  let replaced = false;
  if (session.toBeReplaced) {
    session = await replaceSession(session);
    replaced = true;
  }

  if (!replaced) {
    // We always need to update the idle expires at date -> only if not replaced
    session = await updateSessionIdleExpiresAt(target);
  }

  // Assemble response with user data
  const user = await fetchUser({
    tenantId: session.tenantId,
    userId: session.userId,
  });

  if (!user) {
    throw new Error(
      `User for session could not be found. User id was: ${session.userId}`
    );
  }

  const resolvedSession: ResolvedSession = {
    sessionId: session.sessionId,
    tenantId: session.tenantId,
    idleExpiresAt: session.idleExpiresAt,
    maxExpiresAt: session.maxExpiresAt,
    user: {
      userId: user.userId,
      tenantId: user.tenantId,
      name: user.name,
      email: user.email,
      permissionAssignment: PermissionAssignmentSchema.parse(
        user.permissionAssignment
      ),
    },
  };

  // Populate cache and return result
  SessionCache.set(target.sessionId, { found: true, resolvedSession });

  return {
    found: true,
    session: resolvedSession,
    invalidated: false,
    replaced,
  };
}
