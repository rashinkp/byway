import { TopUpWalletDto } from "../../../dtos/wallet/top-up.dto";
import { Transaction } from "../../../../domain/entities/transaction.entity";

export interface TopUpWalletResponse {
  transaction: Transaction;
  session?: {
    id: string;
    url: string;
    payment_status: string;
    amount_total: number;
  };
}

export interface ITopUpWalletUseCase {
  execute(userId: string, input: TopUpWalletDto): Promise<TopUpWalletResponse>;
}
