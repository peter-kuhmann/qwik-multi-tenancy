import { component$ } from "@builder.io/qwik";

export default component$(() => {
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
});
