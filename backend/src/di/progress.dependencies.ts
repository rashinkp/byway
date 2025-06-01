import { ProgressController } from "../presentation/http/controllers/progress.controller";
import { UpdateProgressUseCase } from "../app/usecases/progress/implementations/update-progress.usecase";
import { GetProgressUseCase } from "../app/usecases/progress/implementations/get-progress.usecase";
import { SharedDependencies } from "./shared.dependencies";

export interface ProgressDependencies {
  progressController: ProgressController;
}

export function createProgressDependencies(
  deps: SharedDependencies
): ProgressDependencies {
  const updateProgressUseCase = new UpdateProgressUseCase(
    deps.enrollmentRepository
  );

  const getProgressUseCase = new GetProgressUseCase(
    deps.enrollmentRepository
  );

  const progressController = new ProgressController(
    updateProgressUseCase,
    getProgressUseCase,
    deps.httpErrors,
    deps.httpSuccess
  );

  return {
    progressController,
  };
} 