import {
  ITransactionOutputDTO,
  IUpdateTransactionStatusInputDTO,
} from "../../../dtos/transaction/transaction.dto";

export interface IUpdateTransactionStatusUseCase {
  execute(
    input: IUpdateTransactionStatusInputDTO
  ): Promise<ITransactionOutputDTO>;
}
