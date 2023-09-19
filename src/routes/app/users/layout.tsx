import { redirectIfPermissionMissing } from "~/utils/redirects";
import { component$, Slot } from "@builder.io/qwik";

export const onGet = redirectIfPermissionMissing("USERS_MANAGE");

export default component$(() => {
  return <Slot />;
});
