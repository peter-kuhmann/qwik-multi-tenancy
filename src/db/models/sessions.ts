import { getPrisma } from "~/db/prisma";

export type TargetSession = {
  sessionId: string;
  tenantId: string;
};

export async function fetchSession(target: TargetSession) {
  return getPrisma().session.findFirst({
    where: target,
  });
}

export async function createSession({
  sessionId,
  tenantId,
  userId,
  idleExpiresAt,
  maxExpiresAt,
}: TargetSession & {
  userId: string;
  idleExpiresAt: Date;
  maxExpiresAt: Date;
}) {
  return getPrisma().session.create({
    data: {
      sessionId,
      tenant: { connect: { tenantId } },
      user: { connect: { userId } },
      idleExpiresAt,
      maxExpiresAt,
      toBeReplaced: false,
    },
  });
}

export async function updateSession(
  target: TargetSession,
  data: {
    idleExpiresAt?: Date;
    maxExpiresAt?: Date;
    toBeReplaced?: boolean;
  }
) {
  return getPrisma().session.update({
    where: {
      sessionId_tenantId: target,
    },
    data: data,
  });
}

export async function deleteSession(target: TargetSession) {
  return getPrisma().session.delete({
    where: {
      sessionId_tenantId: target,
    },
  });
}

export function markUserSessionAsToBeReplaced(userId: string) {
  return getPrisma().session.updateMany({
    where: {
      userId: userId,
    },
    data: {
      toBeReplaced: true,
    },
  });
}
