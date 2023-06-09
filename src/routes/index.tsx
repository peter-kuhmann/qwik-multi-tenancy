import { component$ } from "@builder.io/qwik";
import { useUrlInfo } from "~/routes/plugin@urlInfo";
import { useTenant } from "~/routes/plugin@tenants";
import ProductBaseScreen from "~/components/routes/index/ProductBaseScreen";
import TenantNotFoundScreen from "~/components/routes/TenantNotFoundScreen";
import TenantFoundHomeScreen from "~/components/routes/index/TenantFoundHomeScreen";
import { tenantHead } from "~/utils/head";

export default component$(() => {
  const urlInfo = useUrlInfo();
  const tenant = useTenant();

  if (urlInfo.value.isBase) {
    return <ProductBaseScreen />;
  }

  if (!tenant.value) {
    return <TenantNotFoundScreen />;
  }

  return <TenantFoundHomeScreen />;
});

export const head = tenantHead();
