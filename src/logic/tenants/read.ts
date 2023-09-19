import { getUrlInfo } from "~/logic/urlInfo/read";
import { TenantCache } from "~/logic/tenants/cache";
import type { ResolvedTenant } from "~/logic/tenants/types";
import type { UrlInfo } from "~/logic/urlInfo/types";
import { fetchTenantBySubdomain } from "~/db/models/tenants";

export async function getTenantByUrl(url: URL) {
  return getTenantByUrlInfo(getUrlInfo(url));
}

export async function getTenantByUrlInfo(
  urlInfo: UrlInfo
): Promise<ResolvedTenant | null> {
  // Stop early if the product base is opened
  if (urlInfo.isBase) return null;

  // Use cache first
  const cacheEntry = TenantCache.get(urlInfo.subdomain);
  if (cacheEntry) {
    return cacheEntry.found ? cacheEntry.resolvedTenant : null;
  }

  // Use DB fetch
  const tenant = await fetchTenantBySubdomain(urlInfo.subdomain);

  if (!tenant) {
    TenantCache.set(urlInfo.subdomain, { found: false });
    return null;
  }

  const resolvedTenant = {
    id: tenant.tenantId,
    name: tenant.name,
  };

  TenantCache.set(urlInfo.subdomain, { found: true, resolvedTenant });
  return resolvedTenant;
}
