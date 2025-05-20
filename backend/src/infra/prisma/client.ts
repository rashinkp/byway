import { PrismaClient } from "@prisma/client";

export const prismaClient = new PrismaClient();

export function initializePrisma(): void {
  process.on("SIGTERM", async () => {
    await prismaClient.$disconnect();
    console.log("PrismaClient disconnected");
  });
  process.on("SIGINT", async () => {
    await prismaClient.$disconnect();
    console.log("PrismaClient disconnected");
  });
}
