import { PrismaClient } from "@prisma/client";
import { ILogger } from "../../../app/providers/I.logger";

export interface IDatabaseProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getClient(): PrismaClient;
}

export class PrismaDatabaseProvider implements IDatabaseProvider {
  private client: PrismaClient;

  constructor(private logger: ILogger) {
    this.client = new PrismaClient();
  }

  async connect(): Promise<void> {
    try {
      await this.client.$connect();
      this.logger.info("Connected to the database successfully!");
    } catch (error) {
      this.logger.error("Failed to connect to the database", error);
      throw new Error("Database connection failed");
    }
  }

  async disconnect(): Promise<void> {
    await this.client.$disconnect();
    this.logger.info("Database disconnected");
  }

  getClient(): PrismaClient {
    return this.client;
  }
}
