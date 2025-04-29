import { IDatabaseProvider } from "../database";
import { CourseController } from "../../modules/course/course.controller";
import { CourseService } from "../../modules/course/course.service";
import { CourseRepository } from "../../modules/course/course.repository";
import { UserService } from "../../modules/user/user.service";
import { CategoryService } from "../../modules/category/category.service";

export interface CourseDependencies {
  courseController: CourseController;
  courseRepository: CourseRepository;
  courseService: CourseService;
}

export const initializeCourseDependencies = (
  dbProvider: IDatabaseProvider,
  categoryService: CategoryService,
  userService: UserService
): CourseDependencies => {
  const prisma = dbProvider.getClient();
  const courseRepository = new CourseRepository(prisma);
  const courseService = new CourseService(
    courseRepository,
    categoryService,
    userService
  );
  const courseController = new CourseController(courseService);

  return { courseController, courseRepository , courseService };
};
