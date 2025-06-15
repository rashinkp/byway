import { IGetLatestRevenueUseCase } from "../interfaces/get-latest-revenue.usecase";
import { IRevenueRepository } from "../../../repositories/revenue.repository";
import { GetLatestRevenueParams, GetLatestRevenueResult } from "../../../../domain/dtos/revenue/get-latest-revenue.dto";

export class GetLatestRevenueUseCase implements IGetLatestRevenueUseCase {
  constructor(private readonly revenueRepository: IRevenueRepository) {}

  async execute(params: GetLatestRevenueParams): Promise<GetLatestRevenueResult> {
    const { page = 1, limit = 10 } = params;

    // Get latest revenue data from repository
    const { items, total } = await this.revenueRepository.getLatestRevenue(params);

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }
} 