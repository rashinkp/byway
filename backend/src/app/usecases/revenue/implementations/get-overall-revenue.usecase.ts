import { IGetOverallRevenueUseCase } from "../interfaces/get-overall-revenue.usecase";
import { IRevenueRepository } from "../../../repositories/revenue.repository";
import { TransactionType } from "../../../../domain/enum/transaction-type.enum";
import { TransactionStatus } from "../../../../domain/enum/transaction-status.enum";

export class GetOverallRevenueUseCase implements IGetOverallRevenueUseCase {
  constructor(private readonly revenueRepository: IRevenueRepository) {}

  async execute(params: {
    startDate: Date;
    endDate: Date;
    userId: string;
  }): Promise<{
    totalRevenue: number;
    refundedAmount: number;
    netRevenue: number;
    coursesSold: number;
    period: {
      start: Date;
      end: Date;
    };
  }> {
    const [totalRevenue, refundedAmount, coursesSold] = await Promise.all([
      this.revenueRepository.getTransactionAmounts({
        startDate: params.startDate,
        endDate: params.endDate,
        type: TransactionType.REVENUE,
        status: TransactionStatus.COMPLETED,
        userId: params.userId,
      }),
      this.revenueRepository.getTransactionAmounts({
        startDate: params.startDate,
        endDate: params.endDate,
        type: TransactionType.REFUND,
        status: TransactionStatus.COMPLETED,
        userId: params.userId,
      }),
      this.revenueRepository.getTransactionCounts({
        startDate: params.startDate,
        endDate: params.endDate,
        type: TransactionType.REVENUE,
        status: TransactionStatus.COMPLETED,
        userId: params.userId,
      }),
    ]);

    return {
      totalRevenue: totalRevenue.amount,
      refundedAmount: refundedAmount.amount,
      netRevenue: totalRevenue.amount - refundedAmount.amount,
      coursesSold: coursesSold,
      period: {
        start: params.startDate,
        end: params.endDate,
      },
    };
  }
} 