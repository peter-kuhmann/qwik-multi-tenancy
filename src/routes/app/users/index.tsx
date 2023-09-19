import { component$ } from "@builder.io/qwik";
import { tenantHead } from "~/utils/head";
import AppPage from "~/components/routes/index/app/AppPage";
import UserTable from "~/components/users/UserTable";
import { useRequiredSession, useSession } from "~/routes/plugin@sessions";
import { routeLoader$ } from "@builder.io/qwik-city";
import { fetchTenantUsers } from "~/db/models/users";
import { z } from "zod";

export default component$(() => {
  const session = useRequiredSession();
  const users = useTenantUsers();

  return (
    <AppPage title={"Users"}>
      <UserTable
        showTenantColumn={false}
        currentUserId={session.value.user.userId}
        entries={users.value}
        openHrefPrefix={"/app/users/"}
      />
    </AppPage>
  );
});

export const head = tenantHead("Users");

export const useTenantUsers = routeLoader$(async ({ resolveValue }) => {
  const session = await resolveValue(useSession);
  if (!session) throw new Error("No session");

  if (session.user.permissionAssignment.USERS_MANAGE === true) {
    return UseTenantUsersSchema.parse(await fetchTenantUsers(session.tenantId));
  }

  throw new Error("No permission");
});

const UseTenantUsersSchema = z.array(
  z.object({
    userId: z.string(),
    name: z.string(),
    email: z.string(),
    tenant: z.object({
      tenantId: z.string(),
      name: z.string(),
    }),
  })
);
