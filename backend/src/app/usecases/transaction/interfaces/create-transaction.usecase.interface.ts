import { ICreateTransactionInputDTO, ITransactionOutputDTO } from "../../../../domain/dtos/transaction/transaction.dto";

export interface ICreateTransactionUseCase {
  execute(input: ICreateTransactionInputDTO): Promise<ITransactionOutputDTO>;
} 