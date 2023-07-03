import { component$, Slot } from "@builder.io/qwik";
import classNames from "classnames";

export default component$(() => {
  return (
    <div class={"w-full h-full flex items-center justify-center p-8"}>
      <div
        class={classNames(
          "bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-300/40",
          "min-h-[10rem] w-full max-w-[40rem] px-24 py-16 pb-24"
        )}
      >
        <Slot />
      </div>
    </div>
  );
});
