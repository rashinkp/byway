import { ProgressController } from "../presentation/http/controllers/progress.controller";
import { UpdateProgressUseCase } from "../app/usecases/progress/implementations/update-progress.usecase";
import { GetProgressUseCase } from "../app/usecases/progress/implementations/get-progress.usecase";
import { SharedDependencies } from "./shared.dependencies";
import { LessonProgressRepository } from "../infra/repositories/lesson-progress.repository.impl";

export interface ProgressDependencies {
  progressController: ProgressController;
}

export function createProgressDependencies(
  deps: SharedDependencies
): ProgressDependencies {
  const lessonProgressRepository = new LessonProgressRepository(deps.prisma);

  const updateProgressUseCase = new UpdateProgressUseCase(
    deps.enrollmentRepository,
    lessonProgressRepository,
    deps.lessonRepository
  );
  const getProgressUseCase = new GetProgressUseCase(
    deps.enrollmentRepository,
    lessonProgressRepository,
    deps.lessonRepository
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
