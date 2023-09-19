import { component$ } from "@builder.io/qwik";
import { redirectIfPermissionMissing } from "~/utils/redirects";
import { tenantHead } from "~/utils/head";
import AppPage from "~/components/routes/index/app/AppPage";
import { routeLoader$ } from "@builder.io/qwik-city";
import { useRequiredSession, useSession } from "~/routes/plugin@sessions";
import { fetchAllUsers } from "~/db/models/users";
import { z } from "zod";
import UserTable from "~/components/users/UserTable";

export const onGet = redirectIfPermissionMissing("SUPER_ALL_USERS_MANAGE");

export default component$(() => {
  const session = useRequiredSession();
  const users = useAllUsers();

  return (
    <AppPage title={"All Users"}>
      <UserTable
        showTenantColumn={true}
        currentUserId={session.value.user.userId}
        entries={users.value}
        openHrefPrefix={"/app/super/users/"}
      />
    </AppPage>
  );
});

export const head = tenantHead("All Users");

export const useAllUsers = routeLoader$(async ({ resolveValue }) => {
  const session = await resolveValue(useSession);
  if (!session) throw new Error("No session");

  if (session.user.permissionAssignment.SUPER_ALL_USERS_MANAGE === true) {
    return UseAllUsersSchema.parse(await fetchAllUsers());
  }

  throw new Error("No permission");
});

const UseAllUsersSchema = z.array(
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
