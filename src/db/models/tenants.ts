import { getPrisma } from "~/db/prisma";
import { invalidateTenantCacheEntryBySubdomain } from "~/logic/tenants/cache";

export function fetchTenantBySubdomain(subdomain: string) {
  return getPrisma().tenant.findUnique({
    where: {
      builtInSubdomain: subdomain,
    },
  });
}

export function fetchAllTenants() {
  return getPrisma().tenant.findMany({
    orderBy: [
      {
        name: "asc",
      },
    ],
  });
}

export async function createTenant(data: {
  name: string;
  builtInSubdomain: string;
}) {
  const result = await getPrisma().tenant.create({
    data: {
      name: data.name,
      builtInSubdomain: data.builtInSubdomain,
    },
  });

  // We also cache a "tenant not found result"
  invalidateTenantCacheEntryBySubdomain(data.builtInSubdomain);

  return result;
}

export async function deleteTenant(tenantId: string) {
  const deletedTenant = await getPrisma().tenant.delete({
    where: {
      tenantId,
    },
  });

  invalidateTenantCacheEntryBySubdomain(deletedTenant.builtInSubdomain);
}
