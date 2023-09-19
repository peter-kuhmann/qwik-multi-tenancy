import { component$, Slot } from "@builder.io/qwik";

export default component$<{ title: string }>(({ title }) => {
  return (
    <div>
      <h2 class={"text-2xl font-semibold mb-3"}>{title}</h2>
      <div>
        <Slot />
      </div>
    </div>
  );
});
