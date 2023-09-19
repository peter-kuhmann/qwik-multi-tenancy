import { component$, Slot, useVisibleTask$ } from "@builder.io/qwik";
import showToastsFromQueryParams from "~/components/toasts/showFromQueryParams";

export default component$(() => {
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

  return <Slot />;
});
