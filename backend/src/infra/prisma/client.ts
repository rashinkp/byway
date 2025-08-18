import { PrismaClient } from "@prisma/client";
import { WinstonLogger } from "../providers/logging/winston.logger";

export const prismaClient = new PrismaClient();

export function initializePrisma(): void {
  const logger = new WinstonLogger();
  
  process.on("SIGTERM", async () => {
    await prismaClient.$disconnect();
    logger.info("PrismaClient disconnected");
  });
  process.on("SIGINT", async () => {
    await prismaClient.$disconnect();
    logger.info("PrismaClient disconnected");
  });
}
