import { Transaction } from "../../../../domain/entities/transaction.entity";

interface ServiceResponse<T> {
  data: T;
  message: string;
}

export interface IHandleWalletPaymentUseCase {
  execute(
    userId: string,
    orderId: string,
    amount: number
  ): Promise<ServiceResponse<{ transaction: Transaction }>>;
}
