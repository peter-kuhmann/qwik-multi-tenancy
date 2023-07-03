import { getPrisma } from "~/db/prisma";
import DevTenant from "~/db/DevTenant";

const prisma = getPrisma();

async function main() {
  await prisma.tenant.upsert({
    where: {
      tenantId: DevTenant.id,
    },
    create: {
      tenantId: DevTenant.id,
      builtInSubdomain: DevTenant.builtInSubdomain,
      name: DevTenant.name,
    },
    update: {
      builtInSubdomain: DevTenant.builtInSubdomain,
      name: DevTenant.name,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
