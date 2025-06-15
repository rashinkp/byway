import { SharedDependencies } from "./shared.dependencies";
import { PrismaAnalyticsRepository } from "../infra/repositories/analytics.repository";
import { GetOverallRevenueUseCase } from "../app/usecases/revenue/implementations/get-overall-revenue.usecase";
import { GetCourseRevenueUseCase } from "../app/usecases/revenue/implementations/get-course-revenue.usecase";
import { RevenueController } from "../presentation/http/controllers/revenue.controller";

export const createRevenueDependencies = (sharedDeps: SharedDependencies) => {
  const { prisma, httpErrors, httpSuccess } = sharedDeps;
  const analyticsRepository = new PrismaAnalyticsRepository(prisma);
  
  const getOverallRevenueUseCase = new GetOverallRevenueUseCase(analyticsRepository);
  const getCourseRevenueUseCase = new GetCourseRevenueUseCase(analyticsRepository);
  
  const revenueController = new RevenueController(
    getOverallRevenueUseCase,
    getCourseRevenueUseCase,
    httpErrors,
    httpSuccess
  );

  return {
    revenueController,
  };
};
