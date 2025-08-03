import { ITransactionOutputDTO } from "../../../dtos/transaction/transaction.dto";

export interface IGetTransactionByIdUseCase {
  execute(id: string): Promise<ITransactionOutputDTO | null>;
}
