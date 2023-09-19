import { component$ } from "@builder.io/qwik";
import { tenantHead } from "~/utils/head";
import { useTenant } from "~/routes/plugin@tenants";
import { useUrlInfo } from "~/routes/plugin@urlInfo";
import ProductBaseScreen from "~/components/routes/index/ProductBaseScreen";
import TenantNotFoundScreen from "~/components/routes/index/TenantNotFoundScreen";
import TenantHomeScreen from "~/components/routes/index/TenantHomeScreen";
import type { RequestHandler } from "@builder.io/qwik-city";
import { redirectIfTenantFoundAndLoggedIn } from "~/utils/redirects";

export const onGet: RequestHandler = redirectIfTenantFoundAndLoggedIn;

export default component$(() => {
  const urlInfo = useUrlInfo();
  const tenant = useTenant();

  if (urlInfo.value.isBase) {
    return <ProductBaseScreen />;
  }

  if (!tenant.value) {
    return <TenantNotFoundScreen />;
  }

  return <TenantHomeScreen />;
});

export const head = tenantHead();
