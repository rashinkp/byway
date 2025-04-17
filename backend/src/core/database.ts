import { PrismaClient } from "@prisma/client";

export interface IDatabaseProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getClient(): PrismaClient;
}

export class PrismaDatabaseProvider implements IDatabaseProvider {
  private client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }

  async connect(): Promise<void> {
    try {
      await this.client.$connect();
      console.log("✅ Connected to the database successfully!");
    } catch (error) {
      console.error("❌ Failed to connect to the database:", error);
      process.exit(1);
    }
  }

  async disconnect(): Promise<void> {
    await this.client.$disconnect();
    console.log("🛑 Database disconnected");
  }

  getClient(): PrismaClient {
    return this.client;
  }
}

export const databaseProvider = new PrismaDatabaseProvider();
