import { Wallet } from "../../domain/entities/wallet.entity";
import { IGenericRepository } from "./base/generic-repository.interface";

export interface IWalletRepository extends IGenericRepository<Wallet> {
  findByUserId(userId: string): Promise<Wallet | null>;
} 