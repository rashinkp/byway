import { WalletRecord } from "../records/wallet.record";

export interface IWalletRepository {
  findByUserId(userId: string): Promise<WalletRecord | null>;
  create(wallet: WalletRecord): Promise<WalletRecord>;
  update(wallet: WalletRecord): Promise<WalletRecord>;
  updateBalance(userId: string, amount: number): Promise<WalletRecord>;
} 