import { IGetTransactionsByUserInputDTO, ITransactionOutputDTO } from "../../../../app/dtos/transaction.dto";
import { ITransactionRepository } from "../../../repositories/transaction.repository";
import { IGetTransactionsByUserUseCase } from "../interfaces/get-transactions-by-user.usecase.interface";
import { Transaction } from "../../../../domain/entities/transaction.entity";

export class GetTransactionsByUserUseCase implements IGetTransactionsByUserUseCase {
  constructor(private readonly _transactionRepository: ITransactionRepository) {}

  async execute(
    input: IGetTransactionsByUserInputDTO
  ): Promise<{
    items: ITransactionOutputDTO[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { userId, page = 1, limit = 10 } = input;
    const [transactions, total] = await Promise.all([
      this._transactionRepository.findByUserId(userId, page, limit),
      this._transactionRepository.countByUserId(userId),
    ]);
    const totalPages = Math.ceil(total / limit);
    return {
      items: transactions.map((transaction) => this.mapToDTO(transaction)),
      total,
      page,
      totalPages,
    };
  }

  private mapToDTO(transaction: Transaction): ITransactionOutputDTO {
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
      updatedAt: transaction.updatedAt,
    };
  }
}
