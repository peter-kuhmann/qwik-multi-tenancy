import { PrismaClient } from "@prisma/client";

let prismaClient: null | PrismaClient = null;

export function getPrisma() {
  if (!prismaClient) {
    prismaClient = new PrismaClient();
  }

  return prismaClient;
}
