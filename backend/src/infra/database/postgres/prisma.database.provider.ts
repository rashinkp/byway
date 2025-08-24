import { PrismaClient } from "@prisma/client";
import { ILogger } from "../../../app/providers/logger-provider.interface";

export interface IDatabaseProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getClient(): PrismaClient;
}

export class PrismaDatabaseProvider implements IDatabaseProvider {
  private _client: PrismaClient;

  constructor(private _logger: ILogger) {
    this._client = new PrismaClient();
  }

  async connect(): Promise<void> {
    try {
      await this._client.$connect();
      this._logger.info("Connected to the database successfully!");
    } catch (error) {
      this._logger.error("Failed to connect to the database", error);
      throw new Error("Database connection failed");
    }
  }

  async disconnect(): Promise<void> {
    await this._client.$disconnect();
    this._logger.info("Database disconnected");
  }

  getClient(): PrismaClient {
    return this._client;
  }
}
