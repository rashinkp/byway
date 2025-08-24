import { ITransactionOutputDTO } from "../../../../app/dtos/transaction.dto";
import { ITransactionRepository } from "../../../repositories/transaction.repository";
import { IGetTransactionByIdUseCase } from "../interfaces/get-transaction-by-id.usecase.interface";
import { Transaction } from "../../../../domain/entities/transaction.entity";

export class GetTransactionByIdUseCase implements IGetTransactionByIdUseCase {
  constructor(private readonly _transactionRepository: ITransactionRepository) {}

  async execute(id: string): Promise<ITransactionOutputDTO | null> {
    const transaction = await this._transactionRepository.findById(id);
    if (!transaction) {
      return null;
    }
    return this.mapToDTO(transaction);
  }

  private _mapToDTO(transaction: Transaction): ITransactionOutputDTO {
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
