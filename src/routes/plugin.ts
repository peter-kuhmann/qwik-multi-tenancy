import { routeLoader$ } from "@builder.io/qwik-city";
import { Env } from "~/env";
import { getPrisma } from "~/db/prisma";

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

export const useTenant = routeLoader$(
  async ({ resolveValue }): Promise<ResolvedTenant | undefined> => {
    const urlInfo = await resolveValue(useUrlInfo);

    if (!urlInfo.isBase) {
      const tenant = await getPrisma().tenant.findUnique({
        where: {
          builtInSubdomain: urlInfo.subdomain,
        },
      });

      if (tenant) {
        return {
          id: tenant.id,
          name: tenant.name,
        };
      }
    }
  }
);
