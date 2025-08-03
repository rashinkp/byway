import {
  ICreateTransactionInputDTO,
  ITransactionOutputDTO,
} from "../../../dtos/transaction/transaction.dto";

export interface ICreateTransactionUseCase {
  execute(input: ICreateTransactionInputDTO): Promise<ITransactionOutputDTO>;
}
