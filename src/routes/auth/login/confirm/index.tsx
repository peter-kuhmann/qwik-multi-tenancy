import type { RequestHandler } from "@builder.io/qwik-city";
import { getTenantByUrl } from "~/logic/tenants/read";
import AuthFlowJwtManager from "~/crypto/AuthFlowJwtManager";
import { fetchUserByEmail } from "~/db/models/users";
import { ConfirmLoginTokenQueryParameterName } from "~/routes/auth/login";
import { logUserIn } from "~/logic/sessions/login";
import type { ResolvedTenant } from "~/logic/tenants/types";

export const onGet: RequestHandler = async ({ url, redirect, cookie }) => {
  let loginSuccess = false;
  const tenant = await getTenantByUrl(url);

  if (tenant) {
    const userToLogin = await getUserForLogin(url, tenant);

    if (userToLogin) {
      await logUserIn(userToLogin, cookie);
      loginSuccess = true;
    }
  }

  throw redirect(302, `/?loginSuccess=${loginSuccess}`);
};

async function getUserForLogin(url: URL, tenant: ResolvedTenant) {
  const loginConfirmationToken = url.searchParams.get(
    ConfirmLoginTokenQueryParameterName
  );
  if (!loginConfirmationToken) return null;

  const jwtResult = AuthFlowJwtManager.safeValidateAndParseJwt(
    loginConfirmationToken
  );
  if (!jwtResult.success) return null;

  const payload = jwtResult.payload;
  if (payload.type !== "loginRequest") return null;

  return await fetchUserByEmail({
    email: payload.email,
    tenantId: tenant.id,
  });
}
