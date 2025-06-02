import { CreateLessonContentUseCase } from "../app/usecases/content/implementations/create-content.usecase";
import { DeleteLessonContentUseCase } from "../app/usecases/content/implementations/delete-content.usecase";
import { GetContentByLessonIdUseCase } from "../app/usecases/content/implementations/get-content-by-lesson-id.usecase";
import { UpdateLessonContentUseCase } from "../app/usecases/content/implementations/update-content.usecase";
import { LessonContentController } from "../presentation/http/controllers/content.controller";
import { SharedDependencies } from "./shared.dependencies";

export interface LessonContentDependencies {
  lessonContentController: LessonContentController;
}

export function createLessonContentDependencies(
  deps: SharedDependencies
): LessonContentDependencies {
  const { lessonContentRepository, lessonRepository, courseRepository } = deps;

  const createLessonContentUseCase = new CreateLessonContentUseCase(
    lessonContentRepository,
    lessonRepository,
    courseRepository
  );
  const updateLessonContentUseCase = new UpdateLessonContentUseCase(
    lessonContentRepository
  );
  const getLessonContentByLessonIdUseCase =
    new GetContentByLessonIdUseCase(
      lessonContentRepository,
      lessonRepository,
      deps.enrollmentRepository,
      courseRepository
    );
  const deleteLessonContentUseCase = new DeleteLessonContentUseCase(
    lessonContentRepository
  );

  const lessonContentController = new LessonContentController(
    createLessonContentUseCase,
    updateLessonContentUseCase,
    getLessonContentByLessonIdUseCase,
    deleteLessonContentUseCase,
    deps.httpErrors,
    deps.httpSuccess
  );

  return {
    lessonContentController,
  };
}
