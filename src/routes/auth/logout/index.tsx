import type { Cookie, RequestHandler } from "@builder.io/qwik-city";
import { getTenantByUrl } from "~/logic/tenants/read";
import {
  deleteSessionIdCookie,
  getSessionIdFromCookie,
} from "~/logic/sessions/cookie";
import { deleteSession } from "~/db/models/sessions";

export const onGet: RequestHandler = async ({ cookie, url, redirect }) => {
  await handleLogout(url, cookie);
  throw redirect(302, "/?logoutSuccess=true");
};

async function handleLogout(url: URL, cookie: Cookie) {
  const sessionId = getSessionIdFromCookie(cookie);
  if (!sessionId) return;

  const tenant = await getTenantByUrl(url);
  if (!tenant) return;

  try {
    await deleteSession({ sessionId, tenantId: tenant.id });
  } catch (e) {
    console.error(
      `Logout failed: Session with id ${sessionId} could not be found.`
    );
  } finally {
    deleteSessionIdCookie(cookie);
  }
}
