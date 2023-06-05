import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useTenant, useUrlInfo } from "~/routes/plugin";

export default component$(() => {
  const urlInfo = useUrlInfo();
  const tenant = useTenant();

  console.log("url info =", urlInfo.value);
  console.log("tenant =", tenant.value);

  return (
    <div class={"h-full flex flex-col justify-center items-center"}>
      <h1>Multi-Tenancy with Qwik ⚡️</h1>
      <p>We will build a multi tenant full-stack web application using:</p>

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
});

export const head: DocumentHead = {
  title: "Multi-Tenancy with Qwik ⚡️ | Peter Kuhmann",
};
