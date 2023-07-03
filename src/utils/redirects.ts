import type { RequestHandler } from "@builder.io/qwik-city";
import { getTenantByUrl } from "~/logic/tenants/read";
import { getSessionFromCookieAndTenantId } from "~/logic/sessions/read";

export const redirectToHomeIfNoTenant: RequestHandler = async ({
  next,
  url,
  redirect,
}) => {
  const tenant = await getTenantByUrl(url);
  if (!tenant) {
    throw redirect(302, "/");
  }

  return next();
};

export const redirectToHomeIfNoTenantOrLoggedIn: RequestHandler = async ({
  next,
  url,
  redirect,
  cookie,
}) => {
  const tenant = await getTenantByUrl(url);
  if (!tenant) {
    throw redirect(302, "/");
  }

  const session = await getSessionFromCookieAndTenantId(cookie, tenant.id);
  if (session) {
    throw redirect(302, "/");
  }

  return next();
};
