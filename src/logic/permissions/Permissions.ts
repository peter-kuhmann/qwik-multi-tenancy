export const SuperPermissions = [
  "SUPER_TENANTS_MANAGE",
  "SUPER_ALL_USERS_MANAGE",
] as const;

export const BasePermissions = [
  "USERS_MANAGE",
  "POSTS_READ",
  "POSTS_CREATE",
] as const;

export const Permissions = [...SuperPermissions, ...BasePermissions] as const;

export type SuperPermission = (typeof SuperPermissions)[number];
export type NormalPermission = (typeof BasePermissions)[number];
export type BasePermission = (typeof Permissions)[number];
