import type { PermissionAssignment } from "~/logic/permissions/PermissionAssignment";

export type ResolvedSessionUser = {
  userId: string;
  tenantId: string;
  name: string;
  email: string;
  permissionAssignment: PermissionAssignment;
};

export type ResolvedSession = {
  sessionId: string;
  tenantId: string;
  idleExpiresAt: Date;
  maxExpiresAt: Date;
  user: ResolvedSessionUser;
};
