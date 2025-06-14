import { SharedDependencies } from "./shared.dependencies";
import { PrismaRevenueRepository } from "../infra/repositories/prisma-revenue.repository";
import { GetRevenueAnalyticsUseCase } from "../app/usecases/revenue/implementations/get-revenue-analytics.usecase";
import { GetRevenueAnalyticsController } from "../presentation/http/controllers/analytics.controller";

export const createRevenueDependencies = (sharedDeps: SharedDependencies) => {
  const { prisma, httpErrors, httpSuccess } = sharedDeps;
  const revenueRepository = new PrismaRevenueRepository(prisma);
  const getRevenueAnalyticsUseCase = new GetRevenueAnalyticsUseCase(revenueRepository);
  const revenueController = new GetRevenueAnalyticsController(
    getRevenueAnalyticsUseCase,
    httpErrors,
    httpSuccess
  );

  return {
    revenueController,
  };
}; 