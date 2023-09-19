import type { Cookie } from "@builder.io/qwik-city";
import { zod$ } from "@builder.io/qwik-city";
import { getTenantByUrl } from "~/logic/tenants/read";
import { getSessionFromCookieAndTenantId } from "~/logic/sessions/read";
import {
  deleteUser,
  deleteUserWithoutTenantId,
  fetchUser,
  fetchUserWithoutTenantId,
  updateUserPermissions,
} from "~/db/models/users";
import { z } from "zod";
import type { PermissionAssignment } from "~/logic/permissions/PermissionAssignment";
import {
  BasePermissionAssignmentSchema,
  PermissionAssignmentSchema,
} from "~/logic/permissions/PermissionAssignment";
import { useSession } from "~/routes/plugin@sessions";
import type { ResolveValue } from "@builder.io/qwik-city/middleware/request-handler";

export async function handleUseDeleteUser(
  data: {
    user: { userId: string; tenantId: string };
  },
  url: URL,
  cookie: Cookie
) {
  const tenant = await getTenantByUrl(url);
  if (!tenant) throw new Error("No tenant");

  const session = await getSessionFromCookieAndTenantId(cookie, tenant.id);
  if (!session) throw new Error("No session");

  if (
    !session.user.permissionAssignment.SUPER_ALL_USERS_MANAGE &&
    !session.user.permissionAssignment.USERS_MANAGE
  ) {
    throw new Error("No permission");
  }

  if (
    data.user.userId === session.user.userId &&
    data.user.tenantId === tenant.id
  ) {
    throw new Error("You can not delete yourself");
  }

  if (session.user.permissionAssignment.SUPER_ALL_USERS_MANAGE) {
    await deleteUserWithoutTenantId(data.user.userId);
  } else {
    await deleteUser(data.user);
  }
}

export async function handleUseChangeUserPermission(
  data: {
    user: { userId: string; tenantId: string };
    permissionAssignment: PermissionAssignment;
  },
  url: URL,
  cookie: Cookie
) {
  const tenant = await getTenantByUrl(url);
  if (!tenant) throw new Error("No tenant");

  const session = await getSessionFromCookieAndTenantId(cookie, tenant.id);
  if (!session) throw new Error("No session");

  if (
    !session.user.permissionAssignment.SUPER_ALL_USERS_MANAGE &&
    !session.user.permissionAssignment.USERS_MANAGE
  ) {
    throw new Error("No permission");
  }

  const existingUser = await fetchUser({
    userId: data.user.userId,
    tenantId: data.user.tenantId,
  });

  const permissionUpdates = session.user.permissionAssignment
    .SUPER_ALL_USERS_MANAGE
    ? data.permissionAssignment
    : BasePermissionAssignmentSchema.parse(data.permissionAssignment);

  if (!existingUser) throw new Error("User does not exist");

  await updateUserPermissions(
    { userId: data.user.userId, tenantId: data.user.tenantId },
    {
      ...PermissionAssignmentSchema.parse(existingUser.permissionAssignment),
      ...permissionUpdates,
    }
  );
}

export async function handleUseViewedUser(
  params: Readonly<Record<string, string>>,
  resolveValue: ResolveValue
) {
  const viewedUserId = params.userId;
  if (!viewedUserId) throw new Error("No userId in path");

  const session = await resolveValue(useSession);
  if (!session) throw new Error("No session");

  if (
    !session.user.permissionAssignment.SUPER_ALL_USERS_MANAGE &&
    !session.user.permissionAssignment.USERS_MANAGE
  ) {
    throw new Error("No permission");
  }

  const user =
    session.user.permissionAssignment.SUPER_ALL_USERS_MANAGE === true
      ? await fetchUserWithoutTenantId(viewedUserId)
      : await fetchUser({ userId: viewedUserId, tenantId: session.tenantId });

  if (!user) {
    return null;
  }

  return UseViewedUserSchema.parse(user);
}

const UseViewedUserSchema = z.object({
  userId: z.string(),
  name: z.string(),
  email: z.string(),
  tenant: z.object({
    tenantId: z.string(),
    name: z.string(),
  }),
  permissionAssignment: PermissionAssignmentSchema,
});
