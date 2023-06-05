import { routeLoader$ } from "@builder.io/qwik-city";
import { Env } from "~/env";
import { getPrisma } from "~/db/prisma";
import { LRUCache } from "lru-cache";

export type UrlInfo =
  | {
      isBase: true;
    }
  | { isBase: false; subdomain: string };

export const useUrlInfo = routeLoader$(({ url }): UrlInfo => {
  const { hostname } = url;
  const expectedSubdomainHostnameSuffix = "." + Env.BASE_HOSTNAME;

  if (hostname.endsWith(expectedSubdomainHostnameSuffix)) {
    const subdomain = hostname.substring(
      0,
      hostname.length - expectedSubdomainHostnameSuffix.length
    );

    if (subdomain.length > 0) {
      return {
        isBase: false,
        subdomain,
      };
    }
  }

  return {
    isBase: true,
  };
});

export type ResolvedTenant = {
  id: string;
  name: string;
};

const ResolvedTenantCache = new LRUCache<string, ResolvedTenant>({
  max: 1000,
  ttl: 30 * 1000, // 30s
});

export const useTenant = routeLoader$(
  async ({ resolveValue }): Promise<ResolvedTenant | undefined> => {
    const urlInfo = await resolveValue(useUrlInfo);

    if (!urlInfo.isBase) {
      const cacheHit = ResolvedTenantCache.get(urlInfo.subdomain);

      if (cacheHit) {
        return cacheHit;
      }

      const tenant = await getPrisma().tenant.findUnique({
        where: {
          builtInSubdomain: urlInfo.subdomain,
        },
      });

      if (tenant) {
        const resolvedTenant = {
          id: tenant.id,
          name: tenant.name,
        };

        ResolvedTenantCache.set(urlInfo.subdomain, resolvedTenant);

        return resolvedTenant;
      }
    }
  }
);
