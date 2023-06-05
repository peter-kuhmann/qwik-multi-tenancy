import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useTenant, useUrlInfo } from "~/routes/plugin";

export default component$(() => {
  const urlInfo = useUrlInfo();
  const tenant = useTenant();

  if (urlInfo.value.isBase) {
    return (
      <div class={"flex flex-col items-center justify-center h-full"}>
        <h1>Multi-Tenancy with Qwik ⚡️</h1>
        <p>Please request your own tenant installation!</p>
        <p>This application uses:</p>
        <ul>
          <li>
            <a href={"https://qwik.builder.io/"}>Qwik 🔗</a>
          </li>
          <li>
            <a href={"https://www.prisma.io/"}>Prisma 🔗</a>
          </li>
          <li>
            <a href={"https://planetscale.com/"}>PlanetScale 🔗</a>
          </li>
          <li>
            <a href={"https://fly.io/"}>Fly.io 🔗</a>
          </li>
        </ul>
      </div>
    );
  }

  if (!tenant.value) {
    return (
      <div class={"flex flex-col items-center justify-center h-full"}>
        <h1>Tenant installation not found 😭</h1>
      </div>
    );
  }

  return (
    <div class={"flex flex-col items-center justify-center h-full"}>
      <h1>Welcome to tenant "{tenant.value.name}" 🚀</h1>
      <p>This was very simple to set up! 🤩</p>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Multi-Tenancy with Qwik ⚡️ | Peter Kuhmann",
};
