import { routeLoader$ } from "@builder.io/qwik-city";
import { useTenant } from "~/routes/plugin@tenants";
import { getSessionFromCookieAndTenantId } from "~/logic/sessions/read";
import type { Signal } from "@builder.io/qwik";
import type { ResolvedSession } from "~/logic/sessions/types";

export const useSession = routeLoader$(
  async ({ resolveValue, cookie }): Promise<ResolvedSession | null> => {
    const tenant = await resolveValue(useTenant);
    if (!tenant) return null;

    return getSessionFromCookieAndTenantId(cookie, tenant.id);
  }
);

export const useRequiredSession = (): Signal<ResolvedSession> => {
  const session = useSession();

  if (!session.value) {
    throw new Error("Session required, but was not present.");
  }

  return session;
};
