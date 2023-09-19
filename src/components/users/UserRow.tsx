import { component$ } from "@builder.io/qwik";
import type { UserTableEntry } from "~/components/users/types";
import { OpenOutline } from "qwik-ionicons";

export default component$<{
  entry: UserTableEntry;
  showTenantColumn: boolean;
  openHref: string;
  showMeBadge: boolean;
}>(({ entry, showTenantColumn, openHref, showMeBadge }) => {
  return (
    <tr
      class={
        "hover:bg-gray-900/5 dark:hover:bg-gray-300/5 cursor-pointer transition"
      }
      onClick$={() => {
        location.href = openHref;
      }}
    >
      {showTenantColumn && <td>{entry.tenant.name}</td>}

      <td>
        {entry.name}
        {showMeBadge && (
          <span class={"ml-2 badge badge-primary badge-sm"}>me</span>
        )}
      </td>

      <td>{entry.email}</td>

      <td>
        <a href={openHref} class={"btn btn-square btn-sm btn-ghost"}>
          <OpenOutline />
        </a>
      </td>
    </tr>
  );
});
