import type { RequestHandler } from "@builder.io/qwik-city";
import { getTenantByUrl } from "~/logic/tenants/read";
import { getSessionFromCookieAndTenantId } from "~/logic/sessions/read";
import type { BasePermission } from "~/logic/permissions/Permissions";

export const redirectIfNoTenantOrLoggedIn: RequestHandler = async ({
  next,
  url,
  redirect,
  cookie,
}) => {
  const tenant = await getTenantByUrl(url);
  if (!tenant) {
    throw redirect(302, "/" + url.search);
  }

  const session = await getSessionFromCookieAndTenantId(cookie, tenant.id);
  if (session) {
    throw redirect(302, "/app" + url.search);
  }

  return next();
};

export const redirectIfNoTenantOrLoggedOut: RequestHandler = async ({
  next,
  url,
  redirect,
  cookie,
}) => {
  const tenant = await getTenantByUrl(url);
  if (!tenant) {
    throw redirect(302, "/" + url.search);
  }

  const session = await getSessionFromCookieAndTenantId(cookie, tenant.id);
  if (!session) {
    throw redirect(302, "/" + url.search);
  }

  return next();
};

export const redirectIfTenantFoundAndLoggedIn: RequestHandler = async ({
  next,
  url,
  redirect,
  cookie,
}) => {
  const tenant = await getTenantByUrl(url);
  if (tenant) {
    const session = await getSessionFromCookieAndTenantId(cookie, tenant.id);
    if (session) {
      throw redirect(302, "/app" + url.search);
    }
  }

  return next();
};

export const redirectIfPermissionMissing: (
  permission: BasePermission
) => RequestHandler = (permission) => {
  return async ({ next, url, redirect, cookie }) => {
    const tenant = await getTenantByUrl(url);
    if (!tenant) {
      throw redirect(302, "/" + url.search);
    }

    const session = await getSessionFromCookieAndTenantId(cookie, tenant.id);
    if (!session) {
      throw redirect(302, "/" + url.search);
    }

    if (session.user.permissionAssignment[permission] !== true) {
      throw redirect(302, "/app" + url.search);
    }

    return next();
  };
};
