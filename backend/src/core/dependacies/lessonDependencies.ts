import { IDatabaseProvider } from "../database";
import { LessonController } from "../../modules/lesson/lesson.controller";
import { LessonService } from "../../modules/lesson/lesson.service";
import { LessonRepository } from "../../modules/lesson/lesson.repository";
import { CourseRepository } from "../../modules/course/course.repository";

export interface LessonDependencies {
  lessonController: LessonController;
  lessonRepository: LessonRepository;
  lessonService: LessonService;
}

export const initializeLessonDependencies = (
  dbProvider: IDatabaseProvider,
  courseRepository: CourseRepository
): LessonDependencies => {
  const prisma = dbProvider.getClient();
  const lessonRepository = new LessonRepository(prisma);
  const lessonService = new LessonService(
    lessonRepository,
    courseRepository,
  );
  const lessonController = new LessonController(lessonService);

  return { lessonController , lessonRepository, lessonService  };
};
