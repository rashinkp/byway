import {
  IGetTransactionsByOrderInputDTO,
  ITransactionOutputDTO,
} from "../../../dtos/transaction/transaction.dto";

export interface IGetTransactionsByOrderUseCase {
  execute(
    input: IGetTransactionsByOrderInputDTO
  ): Promise<ITransactionOutputDTO[]>;
}
