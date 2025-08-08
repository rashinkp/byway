import { IGetTransactionsByOrderInputDTO, ITransactionOutputDTO } from "../../../dtos/transaction.dto";


export interface IGetTransactionsByOrderUseCase {
  execute(
    input: IGetTransactionsByOrderInputDTO
  ): Promise<ITransactionOutputDTO[]>;
}
