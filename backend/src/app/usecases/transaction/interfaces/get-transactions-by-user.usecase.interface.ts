import { IGetTransactionsByUserInputDTO, ITransactionOutputDTO } from "../../../../domain/dtos/transaction/transaction.dto";

export interface IGetTransactionsByUserUseCase {
  execute(input: IGetTransactionsByUserInputDTO): Promise<{ items: ITransactionOutputDTO[]; total: number; page: number; totalPages: number }>;
} 