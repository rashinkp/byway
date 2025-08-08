import { IGetTransactionsByUserInputDTO, ITransactionOutputDTO } from "../../../dtos/transaction.dto";


export interface IGetTransactionsByUserUseCase {
  execute(
    input: IGetTransactionsByUserInputDTO
  ): Promise<{
    items: ITransactionOutputDTO[];
    total: number;
    page: number;
    totalPages: number;
  }>;
}
