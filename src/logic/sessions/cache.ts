import { LRUCache } from "lru-cache";
import { Env } from "~/env";
import type { ResolvedSession } from "~/logic/sessions/types";

export type SessionCacheEntry =
  | { found: false }
  | { found: true; resolvedSession: ResolvedSession };

export const SessionCache = new LRUCache<string, SessionCacheEntry>({
  max: Env.SESSIONS_CACHE_MAX_ENTRIES,
  ttl: Env.SESSIONS_CACHE_TTL_SECONDS * 1000,
});
