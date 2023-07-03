import ScreenCard from "~/components/ScreenCard";
import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { Form, routeAction$, zod$ } from "@builder.io/qwik-city";
import {
  ChevronBackOutline,
  MailOutline,
  PersonAddOutline,
  PersonOutline,
} from "qwik-ionicons";
import { z } from "zod";
import AuthFlowJwtManager from "~/crypto/AuthFlowJwtManager";
import { redirectToHomeIfNoTenantOrLoggedIn } from "~/utils/redirects";
import { sendSignUpConfirmationLinkMail } from "~/mail/send/auth";

export const onGet: RequestHandler = redirectToHomeIfNoTenantOrLoggedIn;

export default component$(() => {
  const signUpAction = useSignUpAction();
  const emailSent = useSignal(false);

  useVisibleTask$(({ track }) => {
    track(() => signUpAction.value?.success);
    if (signUpAction.value?.success === true) {
      emailSent.value = true;
    }
  });

  return (
    <>
      <ScreenCard>
        {emailSent.value ? (
          <>
            <h1 class={"mb-12"}>
              <MailOutline /> Sign up link sent
            </h1>

            <div class={"flex flex-col gap-4"}>
              <div>
                We sent a mail with a sign up confirmation link to{" "}
                {signUpAction.formData?.get("email")}
              </div>
              <button
                class={"btn"}
                onClick$={() => {
                  emailSent.value = false;
                }}
              >
                <ChevronBackOutline /> Back to sign up
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 class={"mb-12"}>Sign Up</h1>

            <Form action={signUpAction} class={"flex flex-col gap-4"}>
              <label class={"input-group"}>
                <span>
                  <PersonOutline />
                </span>
                <input
                  name={"name"}
                  required
                  disabled={signUpAction.isRunning}
                  type="text"
                  placeholder="Name"
                  class="input input-bordered w-full"
                />
              </label>

              <label class={"input-group"}>
                <span>
                  <MailOutline />
                </span>
                <input
                  name={"email"}
                  required
                  disabled={signUpAction.isRunning}
                  type="email"
                  placeholder="E-Mail"
                  class="input input-bordered w-full"
                />
              </label>

              <button type={"submit"} class={"btn btn-primary"}>
                {signUpAction.isRunning ? (
                  <span class={"loading loading-dots"} />
                ) : (
                  <>
                    <PersonAddOutline /> Create user account
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

export const ConfirmSignUpTokenQueryParameterName = "token";

export const useSignUpAction = routeAction$(
  ({ email, name }, { request }) => {
    const jwt = AuthFlowJwtManager.createSignedJwt({
      type: "signUpRequest",
      email,
      name,
    });

    const confirmUrl = new URL(request.url);
    confirmUrl.pathname = "/auth/signup/confirm";
    confirmUrl.search = "";
    confirmUrl.searchParams.set(ConfirmSignUpTokenQueryParameterName, jwt);

    sendSignUpConfirmationLinkMail(confirmUrl.href, { email, name });

    return { success: true };
  },
  zod$({
    name: z.string().min(1),
    email: z.string().email(),
  })
);
