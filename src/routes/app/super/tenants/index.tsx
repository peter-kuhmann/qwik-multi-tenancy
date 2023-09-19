import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { redirectIfPermissionMissing } from "~/utils/redirects";
import { tenantHead } from "~/utils/head";
import AppPage from "~/components/routes/index/app/AppPage";
import { Form, routeAction$, routeLoader$, zod$ } from "@builder.io/qwik-city";
import { useSession } from "~/routes/plugin@sessions";
import { z } from "zod";
import {
  createTenant,
  deleteTenant,
  fetchAllTenants,
  fetchTenantBySubdomain,
} from "~/db/models/tenants";
import {
  AddOutline,
  BusinessOutline,
  GlobeOutline,
  OpenOutline,
  TrashOutline,
} from "qwik-ionicons";
import AppPageSection from "~/components/routes/index/app/AppPageSection";
import { getTenantByUrl } from "~/logic/tenants/read";
import { getSessionFromCookieAndTenantId } from "~/logic/sessions/read";
import { useRequiredTenant, useTenant } from "~/routes/plugin@tenants";

export const onGet = redirectIfPermissionMissing("SUPER_TENANTS_MANAGE");

export default component$(() => {
  return (
    <AppPage title={"Tenants"}>
      <div class={"flex flex-col gap-16"}>
        <CreateTenantSection />
        <TenantsTableSection />
      </div>
    </AppPage>
  );
});

const CreateTenantSection = component$(() => {
  const createTenant = useCreateTenant();
  const formRef = useSignal<HTMLFormElement>();

  useVisibleTask$(({ track }) => {
    track(() => createTenant.value?.success);
    if (formRef.value && createTenant.value?.success === true) {
      formRef.value.reset();
    }
  });

  return (
    <AppPageSection title={"Create tenant"}>
      <Form action={createTenant} ref={formRef}>
        <div class={"grid grid-cols-2 gap-8 mb-4"}>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Name</span>
            </label>
            <input
              disabled={createTenant.isRunning}
              type="text"
              name="name"
              required
              placeholder="Enter tenant name"
              class="input input-bordered w-full"
            />
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Built in subdomain</span>
            </label>
            <input
              disabled={createTenant.isRunning}
              type="text"
              required
              name="builtInSubdomain"
              placeholder="Enter built in subdomain"
              class="input input-bordered w-full"
            />
          </div>
        </div>

        {createTenant.value?.error && (
          <div class={"mb-4 text-red-400"}>{createTenant.value.error}</div>
        )}

        <button
          type={"submit"}
          class={"btn btn-primary"}
          disabled={createTenant.isRunning}
        >
          {createTenant.isRunning ? (
            <span class="loading loading-spinner"></span>
          ) : (
            <>
              Create tenant <AddOutline />
            </>
          )}
        </button>
      </Form>
    </AppPageSection>
  );
});

type TenantsTableEntry = {
  tenantId: string;
  name: string;
  builtInSubdomain: string;
};

const TenantsTableSection = component$(() => {
  const tenants = useTenants();
  const currentTenant = useRequiredTenant();
  const deleteTenant = useDeleteTenant();

  return (
    <AppPageSection title={"Available tenants"}>
      <table class={"table"}>
        <thead>
          <tr>
            <td>
              <BusinessOutline class={"mr-2"} /> Name
            </td>
            <td>
              <GlobeOutline class={"mr-2"} />
              Subdomain
            </td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {tenants.value.map((tenant) => (
            <TenantsTableRow
              key={tenant.tenantId}
              entry={tenant}
              isCurrentTenant={tenant.tenantId === currentTenant.value.id}
              onDelete$={async () => {
                await deleteTenant.submit({ tenantId: tenant.tenantId });
              }}
            />
          ))}
        </tbody>
      </table>
    </AppPageSection>
  );
});

const TenantsTableRow = component$<{
  entry: TenantsTableEntry;
  isCurrentTenant: boolean;
  onDelete$: () => void;
}>(({ entry, isCurrentTenant, onDelete$ }) => {
  const loading = useSignal(false);

  return (
    <tr class={"hover:bg-gray-900/5 dark:hover:bg-gray-300/5 transition"}>
      <td>
        {entry.name}
        {isCurrentTenant && (
          <span class={"ml-2 badge badge-primary badge-sm"}>current</span>
        )}
      </td>
      <td>{entry.builtInSubdomain}</td>

      <td>
        {!isCurrentTenant && (
          <button
            class={"btn btn-square btn-sm btn-ghost"}
            onClick$={() => {
              loading.value = true;
              void onDelete$().finally(() => {
                loading.value = false;
              });
            }}
            disabled={loading.value}
          >
            {loading.value ? (
              <span class="loading loading-spinner loading-xs" />
            ) : (
              <TrashOutline />
            )}
          </button>
        )}
      </td>
    </tr>
  );
});

export const head = tenantHead("Tenants");

export const useDeleteTenant = routeAction$(
  async (data, { url, cookie }) => {
    const tenant = await getTenantByUrl(url);
    if (!tenant) throw new Error("No tenant");

    const session = await getSessionFromCookieAndTenantId(cookie, tenant.id);
    if (!session) throw new Error("No session");

    if (!session.user.permissionAssignment.SUPER_TENANTS_MANAGE) {
      throw new Error("No permission");
    }

    if (data.tenantId === tenant.id) {
      throw new Error("You can not delete your own tenant.");
    }

    await deleteTenant(data.tenantId);

    return { success: true };
  },
  zod$({
    tenantId: z.string().nonempty(),
  })
);

export const useCreateTenant = routeAction$(
  async (data, { url, cookie }) => {
    const tenant = await getTenantByUrl(url);
    if (!tenant) throw new Error("No tenant");

    const session = await getSessionFromCookieAndTenantId(cookie, tenant.id);
    if (!session) throw new Error("No session");

    if (!session.user.permissionAssignment.SUPER_TENANTS_MANAGE) {
      throw new Error("No permission");
    }

    const existingTenant = await fetchTenantBySubdomain(data.builtInSubdomain);
    if (existingTenant) {
      return { success: false, error: "Subdomain is already taken" };
    }

    await createTenant(data);

    return { success: true };
  },
  zod$({
    name: z.string().nonempty(),
    builtInSubdomain: z.string().nonempty(),
  })
);

export const useTenants = routeLoader$(async ({ resolveValue }) => {
  const session = await resolveValue(useSession);
  if (!session) throw new Error("No session");

  if (session.user.permissionAssignment.SUPER_TENANTS_MANAGE === true) {
    return UseTenantsSchema.parse(await fetchAllTenants());
  }

  throw new Error("No permission");
});

const UseTenantsSchema = z.array(
  z.object({
    tenantId: z.string(),
    name: z.string(),
    builtInSubdomain: z.string(),
  })
);
