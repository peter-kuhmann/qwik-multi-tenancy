import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { useRequiredSession, useSession } from "~/routes/plugin@sessions";
import {
  LogInOutline,
  LogOutOutline,
  MailOutline,
  PersonAddOutline,
} from "qwik-ionicons";
import { useRequiredTenant } from "~/routes/plugin@tenants";
import showToastsFromQueryParams from "~/components/toasts/showFromQueryParams";

export default component$(() => {
  const tenant = useRequiredTenant();
  const session = useSession();

  useVisibleTask$(
    () => {
      showToastsFromQueryParams({
        "loginSuccess=true": {
          message: "You logged in successfully.",
          options: {
            type: "success",
          },
        },
        "loginSuccess=false": {
          message: "Login failed.",
          options: {
            type: "error",
          },
        },
        "signupSuccess=true": {
          message: "You signed up successfully.",
          options: {
            type: "success",
          },
        },
        "signupSuccess=false": {
          message: "Sign up failed.",
          options: {
            type: "error",
          },
        },
        "logoutSuccess=true": {
          message: "You logged out successfully.",
          options: {
            type: "success",
          },
        },
        "logoutSuccess=false": {
          message: "Logout failed.",
          options: {
            type: "error",
          },
        },
      });
    },
    { strategy: "document-ready" }
  );

  return (
    <div class={"flex flex-col items-center justify-center h-full"}>
      <h1 class={"mb-8"}>Welcome to tenant "{tenant.value.name}" 🚀</h1>

      <div class={"flex flex-col gap-4"}>
        {session.value ? <LoggedIn /> : <LoggedOut />}
      </div>
    </div>
  );
});

const LoggedIn = component$(() => {
  const session = useRequiredSession();

  return (
    <div class={"flex flex-col gap-4 items-center"}>
      <div>Hello, {session.value.user.name} 👋</div>

      <div>
        <MailOutline /> {session.value.user.email}
      </div>

      <a class={"mt-8 btn btn-wide hover:no-underline"} href={"/auth/logout"}>
        <LogOutOutline /> Log out
      </a>
    </div>
  );
});

const LoggedOut = component$(() => {
  return (
    <>
      <a
        class={"btn btn-wide btn-primary hover:no-underline"}
        href={"/auth/login"}
      >
        <LogInOutline /> Log in
      </a>

      <a class={"btn btn-wide hover:no-underline"} href={"/auth/signup"}>
        <PersonAddOutline /> Sign Up
      </a>
    </>
  );
});
