import { component$ } from "@builder.io/qwik";
import { useRequiredTenant } from "~/routes/plugin@tenants";
import { LogInOutline, PersonAddOutline } from "qwik-ionicons";

export default component$(() => {
  const tenant = useRequiredTenant();

  return (
    <div class={"flex flex-col items-center justify-center h-full"}>
      <h1 class={"mb-8"}>Welcome to tenant "{tenant.value.name}" 🚀</h1>

      <div class={"flex flex-col gap-4"}>
        <a
          class={"btn btn-wide btn-primary hover:no-underline"}
          href={"/auth/login"}
        >
          <LogInOutline /> Log in
        </a>

        <a class={"btn btn-wide hover:no-underline"} href={"/auth/signup"}>
          <PersonAddOutline /> Sign Up
        </a>
      </div>
    </div>
  );
});
