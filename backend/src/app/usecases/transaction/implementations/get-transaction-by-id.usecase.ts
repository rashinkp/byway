import { ITransactionOutputDTO } from "../../../../app/dtos/transaction.dto";
import { ITransactionRepository } from "../../../repositories/transaction.repository";
import { IGetTransactionByIdUseCase } from "../interfaces/get-transaction-by-id.usecase.interface";

export class GetTransactionByIdUseCase implements IGetTransactionByIdUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(id: string): Promise<ITransactionOutputDTO | null> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      return null;
    }
    return this.mapToDTO(transaction);
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
      updatedAt: transaction.updatedAt,
    };
  }
}
