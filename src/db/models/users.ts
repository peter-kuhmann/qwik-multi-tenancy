import { getPrisma } from "~/db/prisma";

export type TargetUser = {
  userId: string;
  tenantId: string;
};

export type TargetUserByEmail = {
  email: string;
  tenantId: string;
};

export async function fetchUser(target: TargetUser) {
  return getPrisma().user.findUnique({
    where: {
      userId_tenantId: target,
    },
  });
}

export async function fetchUserByEmail(target: TargetUserByEmail) {
  return getPrisma().user.findUnique({
    where: {
      email_tenantId: target,
    },
  });
}

export async function createUser({
  tenantId,
  email,
  name,
}: {
  tenantId: string;
  email: string;
  name: string;
}) {
  return getPrisma().user.create({
    data: {
      tenant: { connect: { tenantId } },
      email,
      name,
    },
  });
}

export async function updateUser(target: TargetUser, data: { name: string }) {
  return getPrisma().user.update({
    where: {
      userId_tenantId: target,
    },
    data: data,
  });
}

export async function deleteUser(target: TargetUser) {
  return getPrisma().user.delete({
    where: {
      userId_tenantId: target,
    },
  });
}
