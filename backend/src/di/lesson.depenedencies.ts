import { LessonController } from "../presentation/http/controllers/lesson.controller";
import { CreateLessonUseCase } from "../app/usecases/lesson/implementations/create-lesson.usecase";
import { UpdateLessonUseCase } from "../app/usecases/lesson/implementations/update-lesson.usecase";
import { GetLessonByIdUseCase } from "../app/usecases/lesson/implementations/get-lesson-by-id.usecase";
import { GetAllLessonsUseCase } from "../app/usecases/lesson/implementations/get-all-lessons.usecase";
import { DeleteLessonUseCase } from "../app/usecases/lesson/implementations/delete-lesson.usecase";
import { GetPublicLessonsUseCase } from "../app/usecases/lesson/implementations/get-public-lessons.usecase";
import { SharedDependencies } from "./shared.dependencies";

export interface LessonDependencies {
  lessonController: LessonController;
}

export function createLessonDependencies(
  deps: SharedDependencies
): LessonDependencies {
  const { lessonRepository, lessonContentRepository } = deps;

  const createLessonUseCase = new CreateLessonUseCase(
    lessonRepository,
  );
  const updateLessonUseCase = new UpdateLessonUseCase(lessonRepository , deps.lessonContentRepository);
  const getLessonByIdUseCase = new GetLessonByIdUseCase(lessonRepository);
  const getAllLessonsUseCase = new GetAllLessonsUseCase(lessonRepository);
  const deleteLessonUseCase = new DeleteLessonUseCase(lessonRepository);
  const getPublicLessonsUseCase = new GetPublicLessonsUseCase(lessonRepository);

  const lessonController = new LessonController(
    createLessonUseCase,
    updateLessonUseCase,
    getLessonByIdUseCase,
    getAllLessonsUseCase,
    deleteLessonUseCase,
    getPublicLessonsUseCase,
    deps.httpErrors,
    deps.httpSuccess
  );

  return {
    lessonController,
  };
}
