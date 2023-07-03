import { LRUCache } from "lru-cache";
import { Env } from "~/env";
import type { ResolvedTenant } from "~/logic/tenants/types";

export type TenantCacheEntry =
  | { found: false }
  | { found: true; resolvedTenant: ResolvedTenant };

export const TenantCache = new LRUCache<string, TenantCacheEntry>({
  max: Env.TENANTS_CACHE_MAX_ENTRIES,
  ttl: Env.TENANTS_CACHE_TTL_SECONDS * 1000,
});
