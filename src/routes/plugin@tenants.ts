import { routeLoader$ } from "@builder.io/qwik-city";
import { useUrlInfo } from "~/routes/plugin@urlInfo";
import { getTenantByUrlInfo } from "~/logic/tenants/read";
import type { Signal } from "@builder.io/qwik";
import type { ResolvedTenant } from "~/logic/tenants/types";

export const useTenant = routeLoader$(async ({ resolveValue }) => {
  const urlInfo = await resolveValue(useUrlInfo);
  return getTenantByUrlInfo(urlInfo);
});

export const useRequiredTenant = (): Signal<ResolvedTenant> => {
  const tenant = useTenant();

  if (!tenant.value) {
    throw new Error("Tenant required, but not found.");
  }

  return tenant;
};
