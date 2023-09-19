import { component$, Slot } from "@builder.io/qwik";
import { useRequiredTenant } from "~/routes/plugin@tenants";
import { useRequiredSession } from "~/routes/plugin@sessions";
import {
  AccessibilityOutline,
  BusinessOutline,
  FlaskOutline,
  LogOutOutline,
  NewspaperOutline,
  PeopleOutline,
} from "qwik-ionicons";
import { redirectIfNoTenantOrLoggedOut } from "~/utils/redirects";
import { useLocation } from "@builder.io/qwik-city";
import classNames from "classnames";
import { useHasPermission } from "~/hooks/permissions";

export const onGet = redirectIfNoTenantOrLoggedOut;

export default component$(() => {
  const tenant = useRequiredTenant();
  const session = useRequiredSession();

  const canManageTenants = useHasPermission("SUPER_TENANTS_MANAGE");
  const canManageAllUsers = useHasPermission("SUPER_ALL_USERS_MANAGE");
  const canManageUsers = useHasPermission("USERS_MANAGE");

  return (
    <div class={"flex w-full h-full"}>
      <div
        class={
          "flex flex-col w-[20rem] h-full bg-white dark:bg-gray-900 border-r border-gray-200"
        }
      >
        <div class={"h-1 flex-grow p-6"}>
          <div class={"font-bold text-2xl mb-8"}>{tenant.value.name}</div>

          <div class={"flex flex-col gap-2"}>
            <NavigationEntry href={"/app"}>
              <NewspaperOutline /> Posts
            </NavigationEntry>

            {canManageUsers && (
              <NavigationEntry href={"/app/users"}>
                <PeopleOutline /> Users
              </NavigationEntry>
            )}

            <NavigationEntry href={"/app/debug"}>
              <FlaskOutline /> Debug
            </NavigationEntry>
          </div>

          {(canManageTenants || canManageAllUsers) && (
            <div class={"border-t border-gray-200 mt-8 pt-8"}>
              <div class={"text-sm mb-4"}>Super Admin</div>

              <div class={"flex flex-col gap-2"}>
                {canManageTenants && (
                  <NavigationEntry href={"/app/super/tenants"}>
                    <BusinessOutline /> Tenants
                  </NavigationEntry>
                )}

                {canManageAllUsers && (
                  <NavigationEntry href={"/app/super/users"}>
                    <AccessibilityOutline /> All Users
                  </NavigationEntry>
                )}
              </div>
            </div>
          )}
        </div>

        <div class={"px-6"}>
          <div class={"border-t border-gray-200 py-6"}>
            <div class={"font-bold"}>{session.value.user.name}</div>
            <div class={"mb-6"}>{session.value.user.email}</div>

            <a class={"btn btn-outline w-full btn-sm"} href={"/auth/logout"}>
              <LogOutOutline /> Logout
            </a>
          </div>
        </div>
      </div>

      <div class={"w-1 h-full flex-grow bg-gray-50 dark:bg-gray-900"}>
        <Slot />
      </div>
    </div>
  );
});

function normalizePathname(pathname: string) {
  if (!pathname.endsWith("/")) {
    return pathname + "/";
  }

  return pathname;
}

const NavigationEntry = component$<{ href: string }>(({ href }) => {
  const { url } = useLocation();

  const normalizedPathname = normalizePathname(url.pathname);
  const normalizedHref = normalizePathname(href);
  const isActive = normalizedHref === normalizedPathname;
  const isSemiActive =
    normalizedHref !== "/app/" &&
    !isActive &&
    normalizedPathname.startsWith(normalizedHref);

  return (
    <a
      href={normalizedHref}
      class={classNames("btn btn-sm w-full hover:no-underline justify-start", {
        "btn-primary": isActive,
        "btn-primary btn-outline": isSemiActive,
        "btn-ghost": !isActive && !isSemiActive,
      })}
    >
      <Slot />
    </a>
  );
});
