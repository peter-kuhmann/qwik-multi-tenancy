import { component$ } from "@builder.io/qwik";
import AppPage from "~/components/routes/index/app/AppPage";
import { useRequiredSession } from "~/routes/plugin@sessions";
import type { BasePermission } from "~/logic/permissions/Permissions";
import AppPageSection from "~/components/routes/index/app/AppPageSection";
import { tenantHead } from "~/utils/head";

export default component$(() => {
  const session = useRequiredSession();
  const permissions = Object.entries(session.value.user.permissionAssignment)
    .filter(([, assigned]) => assigned)
    .map(([name]) => name) as BasePermission[];

  return (
    <AppPage title={"Debug"}>
      <AppPageSection title={"Permissions"}>
        {permissions.length === 0 ? (
          <>You don't have any permissions.</>
        ) : (
          <>
            You have the following permissions:
            <ul class={"pl-8"}>
              {permissions.map((permission) => (
                <li key={permission}>{permission}</li>
              ))}
            </ul>
          </>
        )}
      </AppPageSection>
    </AppPage>
  );
});

export const head = tenantHead("Debug");
