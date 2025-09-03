
import { SharedDependencies } from "./shared.dependencies";
import { GetOverallRevenueUseCase } from "../app/usecases/revenue/implementations/get-overall-revenue.usecase";
import { GetCourseRevenueUseCase } from "../app/usecases/revenue/implementations/get-course-revenue.usecase";
import { RevenueController } from "../presentation/http/controllers/revenue.controller";
import { GetLatestRevenueUseCase } from "../app/usecases/revenue/implementations/get-latest-revenue.usecase";
import { RevenueRepository } from "../infra/repositories/revenue.repository";

export const createRevenueDependencies = (sharedDeps: SharedDependencies) => {
  const { prisma, httpErrors, httpSuccess } = sharedDeps;
  const revenueRepository = new RevenueRepository(prisma);

  const getOverallRevenueUseCase = new GetOverallRevenueUseCase(
    revenueRepository
  );
  const getCourseRevenueUseCase = new GetCourseRevenueUseCase(
    revenueRepository
  );
  const getLatestRevenueUseCase = new GetLatestRevenueUseCase(
    revenueRepository
  );

  const revenueController = new RevenueController(
    getOverallRevenueUseCase,
    getCourseRevenueUseCase,
    getLatestRevenueUseCase,
    httpErrors,
    httpSuccess
  );

  return {
    revenueController,
  };
};
