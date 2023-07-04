import ScreenCard from "~/components/ScreenCard";
import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { Form, routeAction$, zod$ } from "@builder.io/qwik-city";
import { ChevronBackOutline, LogInOutline, MailOutline } from "qwik-ionicons";
import AuthFlowJwtManager from "~/crypto/AuthFlowJwtManager";
import { z } from "zod";
import { redirectToHomeIfNoTenantOrLoggedIn } from "~/utils/redirects";
import { fetchUserByEmail } from "~/db/models/users";
import { getTenantByUrl } from "~/logic/tenants/read";
import { sendLoginConfirmationLinkMail } from "~/mail/send/auth";
import { tenantHead } from "~/utils/head";

export const onGet: RequestHandler = redirectToHomeIfNoTenantOrLoggedIn;

export default component$(() => {
  const loginAction = useLoginAction();
  const emailSent = useSignal(false);

  useVisibleTask$(({ track }) => {
    track(() => loginAction.value?.success);
    if (loginAction.value?.success === true) {
      emailSent.value = true;
    }
  });

  return (
    <>
      <ScreenCard>
        {emailSent.value ? (
          <>
            <h1 class={"mb-12"}>
              <MailOutline /> Login link sent
            </h1>

            <div class={"flex flex-col gap-4"}>
              <div>
                We sent a mail with a login confirmation link to{" "}
                {loginAction.formData?.get("email")}
              </div>
              <button
                class={"btn"}
                onClick$={() => {
                  emailSent.value = false;
                }}
              >
                <ChevronBackOutline /> Back to login
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 class={"mb-12"}>Login</h1>

            <Form
              action={loginAction}
              class={"flex flex-col gap-4 min-w-[20rem]"}
            >
              <label class={"input-group"}>
                <span>
                  <MailOutline />
                </span>
                <input
                  name={"email"}
                  required
                  disabled={loginAction.isRunning}
                  type="email"
                  placeholder="E-Mail"
                  class="input input-bordered w-full"
                />
              </label>

              <button type={"submit"} class={"btn btn-primary"}>
                {loginAction.isRunning ? (
                  <span class={"loading loading-dots"} />
                ) : (
                  <>
                    <LogInOutline /> Log in to your account
                  </>
                )}
              </button>

              <a href={"/"} class={"btn hover:no-underline"}>
                <ChevronBackOutline /> Back to home
              </a>
            </Form>
          </>
        )}
      </ScreenCard>
    </>
  );
});

export const ConfirmLoginTokenQueryParameterName = "token";

export const useLoginAction = routeAction$(
  async ({ email }, { request, url }) => {
    const tenant = await getTenantByUrl(url);
    if (tenant) {
      const user = await fetchUserByEmail({ email, tenantId: tenant.id });

      if (user) {
        const jwt = AuthFlowJwtManager.createSignedJwt({
          type: "loginRequest",
          email,
          tenantId: tenant.id,
        });

        const confirmUrl = new URL(request.url);
        confirmUrl.pathname = "/auth/login/confirm";
        confirmUrl.search = "";
        confirmUrl.searchParams.set(ConfirmLoginTokenQueryParameterName, jwt);

        sendLoginConfirmationLinkMail(confirmUrl.href, tenant.name, {
          email,
          name: user.name,
        });
      }
    }

    return { success: true };
  },
  zod$({
    email: z.string().email(),
  })
);

export const head = tenantHead("Login");
