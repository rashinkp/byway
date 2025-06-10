import { ITransactionRepository } from "../../../repositories/transaction.repository";
import { IGetTransactionsByOrderUseCase } from "../interfaces/get-transactions-by-order.usecase.interface";
import { IGetTransactionsByOrderInputDTO, ITransactionOutputDTO } from "../../../../domain/dtos/transaction/transaction.dto";

export class GetTransactionsByOrderUseCase implements IGetTransactionsByOrderUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository
  ) {}

  async execute(input: IGetTransactionsByOrderInputDTO): Promise<ITransactionOutputDTO[]> {
    const transaction = await this.transactionRepository.findByOrderId(input.orderId);
    if (!transaction) {
      return [];
    }
    return [this.mapToDTO(transaction)];
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