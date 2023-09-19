import { z } from "zod";
import type {
  BasePermission,
  NormalPermission,
  SuperPermission,
} from "~/logic/permissions/Permissions";

const SuperAssignments: { [key in SuperPermission]: z.ZodBoolean } = {
  SUPER_TENANTS_MANAGE: z.boolean(),
  SUPER_ALL_USERS_MANAGE: z.boolean(),
};

const BaseAssignments: { [key in NormalPermission]: z.ZodBoolean } = {
  USERS_MANAGE: z.boolean(),
  POSTS_READ: z.boolean(),
  POSTS_CREATE: z.boolean(),
};

const Assignments: { [key in BasePermission]: z.ZodBoolean } = {
  ...SuperAssignments,
  ...BaseAssignments,
};

export const SuperPermissionAssignmentSchema = z
  .object(SuperAssignments)
  .partial();
export const BasePermissionAssignmentSchema = z
  .object(BaseAssignments)
  .partial();
export const PermissionAssignmentSchema = z.object(Assignments).partial();

export type SuperPermissionAssignment = z.infer<
  typeof SuperPermissionAssignmentSchema
>;
export type NormalPermissionAssignment = z.infer<
  typeof BasePermissionAssignmentSchema
>;
export type PermissionAssignment = z.infer<typeof PermissionAssignmentSchema>;
