import { IGetLatestRevenueUseCase } from "../interfaces/get-latest-revenue.usecase";
import { IRevenueRepository } from "../../../repositories/revenue.repository";
import { GetLatestRevenueParamsDTO, GetLatestRevenueResultDTO } from "../../../dtos/revenue.dto";

export class GetLatestRevenueUseCase implements IGetLatestRevenueUseCase {
  constructor(private readonly revenueRepository: IRevenueRepository) {}

  async execute(
    params: GetLatestRevenueParamsDTO
  ): Promise<GetLatestRevenueResultDTO> {
    const { page = 1, limit = 10 } = params;

    // Get latest revenue data from repository
    const { items, total } = await this.revenueRepository.getLatestRevenue(
      params
    );

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
