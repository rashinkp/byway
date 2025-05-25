import { ITransactionRepository } from "../../../repositories/transaction.repository";
import { IUpdateTransactionStatusUseCase } from "../interfaces/update-transaction-status.usecase.interface";
import { ITransactionOutputDTO, IUpdateTransactionStatusInputDTO } from "../../../../domain/dtos/transaction/transaction.dto";

export class UpdateTransactionStatusUseCase implements IUpdateTransactionStatusUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository
  ) {}

  async execute(input: IUpdateTransactionStatusInputDTO): Promise<ITransactionOutputDTO> {
    const transaction = await this.transactionRepository.updateStatus(
      input.id,
      input.status,
      input.metadata
    );
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
      updatedAt: transaction.updatedAt
    };
  }
} 