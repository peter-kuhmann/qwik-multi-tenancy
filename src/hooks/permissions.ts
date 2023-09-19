import type { BasePermission } from "~/logic/permissions/Permissions";
import { useSession } from "~/routes/plugin@sessions";

export function useHasPermission(permission: BasePermission): boolean {
  const session = useSession().value;
  if (!session) return false;

  const value = session.user.permissionAssignment[permission];
  return value === true;
}
