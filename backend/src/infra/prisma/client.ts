import { PrismaClient } from "@prisma/client";
import { ILogger } from "../../app/providers/logger-provider.interface";

export const prismaClient = new PrismaClient();

export function initializePrisma(logger: ILogger): void {
  process.on("SIGTERM", async () => {
    await prismaClient.$disconnect();
    logger.info("PrismaClient disconnected");
  });
  process.on("SIGINT", async () => {
    await prismaClient.$disconnect();
    logger.info("PrismaClient disconnected");
  });
}
