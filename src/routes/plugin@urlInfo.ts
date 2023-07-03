import { routeLoader$ } from "@builder.io/qwik-city";
import { getUrlInfo } from "~/logic/urlInfo/read";
import type { UrlInfo } from "~/logic/urlInfo/types";

export const useUrlInfo = routeLoader$(({ url }): UrlInfo => {
  return getUrlInfo(url);
});
