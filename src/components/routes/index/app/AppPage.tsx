import { component$, Slot } from "@builder.io/qwik";
import { ArrowBackOutline } from "qwik-ionicons";

export default component$<{
  title: string;
  back?: { label: string; href: string };
}>(({ title, back }) => {
  return (
    <div class={"w-full h-full overflow-y-auto"}>
      <div class={"p-16"}>
        {back && (
          <div class={"mb-4"}>
            <a href={back.href} class={"btn btn-sm btn-ghost"}>
              <ArrowBackOutline /> {back.label}
            </a>
          </div>
        )}

        <h1 class={"font-bold text-4xl mb-12"}>
          {title}
          <Slot name={"title"} />
        </h1>

        <Slot />
      </div>
    </div>
  );
});
