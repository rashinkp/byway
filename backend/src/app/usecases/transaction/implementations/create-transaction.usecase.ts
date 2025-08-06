import { ITransactionRepository } from "../../../repositories/transaction.repository";
import { ICreateTransactionUseCase } from "../interfaces/create-transaction.usecase.interface";
import {
  ICreateTransactionInputDTO,
  ITransactionOutputDTO,
} from "../../../dtos/transaction.dto";
import { Transaction } from "../../../../domain/entities/transaction.entity";
import { TransactionType } from "../../../../domain/enum/transaction-type.enum";
import { TransactionStatus } from "../../../../domain/enum/transaction-status.enum";
import { PaymentGateway } from "../../../../domain/enum/payment-gateway.enum";

export class CreateTransactionUseCase implements ICreateTransactionUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(
    input: ICreateTransactionInputDTO
  ): Promise<ITransactionOutputDTO> {
    const transaction = new Transaction({
      orderId: input.orderId,
      userId: input.userId,
      amount: input.amount,
      type: input.type || TransactionType.PURCHASE,
      status: input.status || TransactionStatus.PENDING,
      paymentGateway: input.paymentGateway || PaymentGateway.STRIPE,
      paymentMethod: input.paymentMethod,
      paymentDetails: input.paymentDetails,
      courseId: input.courseId,
      transactionId: input.transactionId,
      metadata: input.metadata,
    });

    const createdTransaction = await this.transactionRepository.create(
      transaction
    );
    return this.mapToDTO(createdTransaction);
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
