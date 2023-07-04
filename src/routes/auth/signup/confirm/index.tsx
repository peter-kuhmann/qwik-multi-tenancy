import type { RequestHandler } from "@builder.io/qwik-city";
import { ConfirmSignUpTokenQueryParameterName } from "~/routes/auth/signup";
import AuthFlowJwtManager from "~/crypto/AuthFlowJwtManager";
import { createUser, fetchUserByEmail } from "~/db/models/users";
import { getTenantByUrl } from "~/logic/tenants/read";
import { logUserIn } from "~/logic/sessions/login";
import type { ResolvedTenant } from "~/logic/tenants/types";

export const onGet: RequestHandler = async ({ url, redirect, cookie }) => {
  let signupSuccess = false;
  const tenant = await getTenantByUrl(url);

  if (tenant) {
    const newUser = await createNewUser(url, tenant);

    if (newUser) {
      await logUserIn(newUser, cookie);
      signupSuccess = true;
    }
  }

  throw redirect(302, `/?signupSuccess=${signupSuccess}`);
};

async function createNewUser(url: URL, tenant: ResolvedTenant) {
  const confirmSignUpToken = url.searchParams.get(
    ConfirmSignUpTokenQueryParameterName
  );
  if (!confirmSignUpToken) return;

  const jwtResult =
    AuthFlowJwtManager.safeValidateAndParseJwt(confirmSignUpToken);
  if (!jwtResult.success) return;

  const payload = jwtResult.payload;
  if (payload.type !== "signUpRequest") return;

  if (payload.tenantId !== tenant.id) return;

  const existingUser = await fetchUserByEmail({
    email: payload.email,
    tenantId: tenant.id,
  });
  if (existingUser) return existingUser;

  return createUser({
    tenantId: tenant.id,
    email: payload.email,
    name: payload.name,
  });
}
