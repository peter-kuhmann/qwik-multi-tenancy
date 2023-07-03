import type { DocumentHead } from "@builder.io/qwik-city";
import { useTenant } from "~/routes/plugin@tenants";

export function tenantHead(prefix?: string): DocumentHead {
  return ({ resolveValue }) => {
    const tenant = resolveValue(useTenant);
    const baseTitle = tenant ? tenant.name : "Multi-Tenancy with Qwik ⚡️";

    return {
      title: prefix ? `${prefix} | ${baseTitle}` : baseTitle,
    };
  };
}
