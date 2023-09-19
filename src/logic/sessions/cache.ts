import { LRUCache } from "lru-cache";
import { Env } from "~/env";
import type { ResolvedSession } from "~/logic/sessions/types";
import { getPrisma } from "~/db/prisma";

export type SessionCacheEntry =
  | { found: false }
  | { found: true; resolvedSession: ResolvedSession };

export const SessionCache = new LRUCache<string, SessionCacheEntry>({
  max: Env.SESSIONS_CACHE_MAX_ENTRIES,
  ttl: Env.SESSIONS_CACHE_TTL_SECONDS * 1000,
});

export function invalidateSessionCacheEntry(sessionId: string) {
  SessionCache.delete(sessionId);
}

export async function invalidateAllSessionCacheEntriesOfUser(userId: string) {
  const user = await getPrisma().user.findUnique({
    where: { userId },
    select: {
      sessions: {
        select: { sessionId: true },
      },
    },
  });

  if (user) {
    user.sessions.forEach((session) => {
      invalidateSessionCacheEntry(session.sessionId);
    });
  }
}
