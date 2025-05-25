import { ITransactionRepository } from "../../../repositories/transaction.repository";
import { IGetTransactionsByUserUseCase } from "../interfaces/get-transactions-by-user.usecase.interface";
import { IGetTransactionsByUserInputDTO, ITransactionOutputDTO } from "../../../../domain/dtos/transaction/transaction.dto";

export class GetTransactionsByUserUseCase implements IGetTransactionsByUserUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository
  ) {}

  async execute(input: IGetTransactionsByUserInputDTO): Promise<ITransactionOutputDTO[]> {
    const transactions = await this.transactionRepository.findByUserId(
      input.userId,
      input.page,
      input.limit
    );
    return transactions.map(transaction => this.mapToDTO(transaction));
  }

  private mapToDTO(transaction: any): ITransactionOutputDTO {
    return {
      id: transaction.id,
      orderId: transaction.orderId,
      userId: transaction.userId,
      amount: transaction.amount,
      type: transaction.type,
      status: transaction.status,
      paymentGateway: transaction.paymentGateway,
      paymentMethod: transaction.paymentMethod,
      paymentDetails: transaction.paymentDetails,
      courseId: transaction.courseId,
      transactionId: transaction.transactionId,
      metadata: transaction.metadata,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt
    };
  }
} 