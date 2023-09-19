import { getPrisma } from "~/db/prisma";
import type { PermissionAssignment } from "~/logic/permissions/PermissionAssignment";
import { PermissionAssignmentSchema } from "~/logic/permissions/PermissionAssignment";
import { invalidateAllSessionCacheEntriesOfUser } from "~/logic/sessions/cache";
import { ta } from "date-fns/locale";
import { markUserSessionAsToBeReplaced } from "~/db/models/sessions";

export type TargetUser = {
  userId: string;
  tenantId: string;
};

export type TargetUserByEmail = {
  email: string;
  tenantId: string;
};

export async function fetchTenantUsers(tenantId: string) {
  return getPrisma().user.findMany({
    where: {
      tenantId,
    },
    include: {
      tenant: {
        select: {
          tenantId: true,
          name: true,
        },
      },
    },
    orderBy: [
      {
        name: "asc",
      },
    ],
  });
}

export async function fetchAllUsers() {
  return getPrisma().user.findMany({
    include: {
      tenant: {
        select: {
          tenantId: true,
          name: true,
        },
      },
    },
    orderBy: [
      {
        name: "asc",
      },
      {
        tenant: {
          name: "asc",
        },
      },
    ],
  });
}

export async function fetchUser(target: TargetUser) {
  return getPrisma().user.findUnique({
    where: {
      userId_tenantId: target,
    },
    include: {
      tenant: {
        select: {
          tenantId: true,
          name: true,
        },
      },
    },
  });
}

export async function fetchUserWithoutTenantId(userId: string) {
  return getPrisma().user.findUnique({
    where: {
      userId,
    },
    include: {
      tenant: {
        select: {
          tenantId: true,
          name: true,
        },
      },
    },
  });
}

export async function fetchUserByEmail(target: TargetUserByEmail) {
  return getPrisma().user.findUnique({
    where: {
      email_tenantId: target,
    },
    include: {
      tenant: {
        select: {
          tenantId: true,
          name: true,
        },
      },
    },
  });
}

export async function createUser({
  tenantId,
  email,
  name,
  permissionAssignment,
}: {
  tenantId: string;
  email: string;
  name: string;
  permissionAssignment: PermissionAssignment;
}) {
  return getPrisma().user.create({
    data: {
      tenant: { connect: { tenantId } },
      email,
      name,
      permissionAssignment:
        PermissionAssignmentSchema.parse(permissionAssignment),
    },
  });
}

export async function updateUser(target: TargetUser, data: { name: string }) {
  const result = await getPrisma().user.update({
    where: {
      userId_tenantId: target,
    },
    data: data,
  });

  await invalidateAllSessionCacheEntriesOfUser(target.userId);

  return result;
}

export async function updateUserPermissions(
  target: TargetUser,
  permissionAssignment: PermissionAssignment
) {
  const result = await getPrisma().user.update({
    where: {
      userId_tenantId: target,
    },
    data: {
      permissionAssignment:
        PermissionAssignmentSchema.parse(permissionAssignment),
    },
  });

  await markUserSessionAsToBeReplaced(target.userId);

  await invalidateAllSessionCacheEntriesOfUser(target.userId);

  return result;
}

export async function deleteUser(target: TargetUser) {
  const result = await getPrisma().user.delete({
    where: {
      userId_tenantId: target,
    },
  });

  await invalidateAllSessionCacheEntriesOfUser(target.userId);

  return result;
}

export async function deleteUserWithoutTenantId(userId: string) {
  const result = await getPrisma().user.delete({
    where: {
      userId,
    },
  });

  await invalidateAllSessionCacheEntriesOfUser(userId);

  return result;
}
