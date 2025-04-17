import { IDatabaseProvider } from "../database";
import { CourseController } from "../../modules/course/course.controller";
import { CourseService } from "../../modules/course/course.service";
import { CourseRepository } from "../../modules/course/course.repository";
import { CategoryRepository } from "../../modules/category/category.repository";

export interface CourseDependencies {
  courseController: CourseController;
  courseRepository: CourseRepository;
}

export const initializeCourseDependencies = (
  dbProvider: IDatabaseProvider,
  categoryRepository: CategoryRepository
): CourseDependencies => {
  const prisma = dbProvider.getClient();
  const courseRepository = new CourseRepository(prisma);
  const courseService = new CourseService(courseRepository, categoryRepository);
  const courseController = new CourseController(courseService);

  return { courseController, courseRepository };
};
