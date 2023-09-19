import { component$ } from "@builder.io/qwik";
import type { UserTableEntry } from "~/components/users/types";
import UserRow from "~/components/users/UserRow";
import {
  Bus,
  BusinessOutline,
  MailOutline,
  PersonOutline,
} from "qwik-ionicons";

export default component$<{
  entries: UserTableEntry[];
  showTenantColumn: boolean;
  currentUserId: string;
  openHrefPrefix: string;
}>(({ entries, showTenantColumn, currentUserId, openHrefPrefix }) => {
  return (
    <table class={"table"}>
      <thead>
        <tr>
          {showTenantColumn && (
            <td>
              <BusinessOutline class={"mr-2"} /> Tenant
            </td>
          )}
          <td>
            <PersonOutline class={"mr-2"} /> Name
          </td>
          <td>
            <MailOutline class={"mr-2"} /> E-Mail
          </td>
          <td>Actions</td>
        </tr>
      </thead>

      <tbody>
        {entries.map((entry) => (
          <UserRow
            key={entry.userId}
            entry={entry}
            showTenantColumn={showTenantColumn}
            openHref={openHrefPrefix + entry.userId}
            showMeBadge={currentUserId === entry.userId}
          />
        ))}
      </tbody>
    </table>
  );
});
