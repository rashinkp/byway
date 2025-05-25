import { ITransactionOutputDTO, IUpdateTransactionStatusInputDTO } from "../../../../domain/dtos/transaction/transaction.dto";

export interface IUpdateTransactionStatusUseCase {
  execute(input: IUpdateTransactionStatusInputDTO): Promise<ITransactionOutputDTO>;
} 