import { Env } from "~/env";
import type { UrlInfo } from "~/logic/urlInfo/types";

export function getUrlInfo(url: URL): UrlInfo {
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
}
