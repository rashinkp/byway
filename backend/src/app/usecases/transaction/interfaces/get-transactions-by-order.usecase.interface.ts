import { IGetTransactionsByOrderInputDTO, ITransactionOutputDTO } from "../../../../domain/dtos/transaction/transaction.dto";

export interface IGetTransactionsByOrderUseCase {
  execute(input: IGetTransactionsByOrderInputDTO): Promise<ITransactionOutputDTO[]>;
} 