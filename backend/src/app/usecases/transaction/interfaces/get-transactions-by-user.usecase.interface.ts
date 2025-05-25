import { IGetTransactionsByUserInputDTO, ITransactionOutputDTO } from "../../../../domain/dtos/transaction/transaction.dto";

export interface IGetTransactionsByUserUseCase {
  execute(input: IGetTransactionsByUserInputDTO): Promise<ITransactionOutputDTO[]>;
} 