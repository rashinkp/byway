import { Wallet } from "../../domain/entities/wallet.entity";

export interface IWalletRepository {
  findByUserId(userId: string): Promise<Wallet | null>;
  create(wallet: Wallet): Promise<Wallet>;
  update(wallet: Wallet): Promise<Wallet>;
  findById(id: string): Promise<Wallet | null>;
} 