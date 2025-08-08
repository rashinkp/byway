import { ICreateTransactionInputDTO, ITransactionOutputDTO } from "../../../dtos/transaction.dto";


export interface ICreateTransactionUseCase {
  execute(input: ICreateTransactionInputDTO): Promise<ITransactionOutputDTO>;
}
