import { component$ } from "@builder.io/qwik";
import AppPage from "~/components/routes/index/app/AppPage";
import { useRequiredSession } from "~/routes/plugin@sessions";
import UserDetails from "~/components/users/UserDetails";
import { routeAction$, routeLoader$, zod$ } from "@builder.io/qwik-city";
import {
  handleUseChangeUserPermission,
  handleUseDeleteUser,
  handleUseViewedUser,
} from "~/sharedActionsAndLoaders/users";
import { z } from "zod";
import { PermissionAssignmentSchema } from "~/logic/permissions/PermissionAssignment";
import { tenantHead } from "~/utils/head";

export default component$(() => {
  const session = useRequiredSession();

  const viewedUser = useViewedUser().value;
  const { submit: changeUserPermission } = useChangeUserPermission();
  const { submit: deleteUser } = useDeleteUser();

  if (!viewedUser) return <>User not found</>;

  const isMe = session.value.user.userId === viewedUser.userId;

  return (
    <AppPage
      title={viewedUser.name}
      back={{ label: "Back to user list", href: "/app/users" }}
    >
      {isMe && (
        <span q:slot={"title"} class={"ml-6 align-middle badge badge-primary"}>
          me
        </span>
      )}

      <UserDetails
        user={viewedUser}
        isSuperView={false}
        isMe={isMe}
        showSuperPermissions={
          session.value.user.permissionAssignment.SUPER_ALL_USERS_MANAGE ===
          true
        }
        showDeletion={session.value.user.userId !== viewedUser.userId}
        onPermissionAssignmentChanged$={async (user, permission, assigned) => {
          await changeUserPermission({
            user,
            permissionAssignment: { [permission]: assigned },
          });
        }}
        onDelete$={async (user) => {
          await deleteUser({ user }).then(() => {
            location.pathname = "/app/users";
          });
        }}
      />
    </AppPage>
  );
});

export const head = tenantHead(({ resolveValue }) => {
  const viewedUser = resolveValue(useViewedUser);
  if (!viewedUser) return "User not found";
  return viewedUser.name;
});

export const useDeleteUser = routeAction$(
  async (data, { url, cookie }) => {
    return handleUseDeleteUser(data, url, cookie);
  },
  zod$({
    user: z.object({
      userId: z.string().nonempty(),
      tenantId: z.string().nonempty(),
    }),
  })
);

export const useChangeUserPermission = routeAction$(
  async (data, { url, cookie }) => {
    return handleUseChangeUserPermission(data, url, cookie);
  },
  zod$({
    user: z.object({
      userId: z.string().nonempty(),
      tenantId: z.string().nonempty(),
    }),
    permissionAssignment: PermissionAssignmentSchema,
  })
);

export const useViewedUser = routeLoader$(async ({ resolveValue, params }) => {
  return handleUseViewedUser(params, resolveValue);
});
