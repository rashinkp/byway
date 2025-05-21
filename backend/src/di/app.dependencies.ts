import { AuthController } from "../presentation/http/controllers/auth.controller";
import { CategoryController } from "../presentation/http/controllers/category.controller";
import { CourseController } from "../presentation/http/controllers/course.controller";
import { InstructorController } from "../presentation/http/controllers/instructor.controller";
import { UserController } from "../presentation/http/controllers/user.controller";
import { LessonController } from "../presentation/http/controllers/lesson.controller";
import { createAuthDependencies } from "./auth.dependencies";
import { createCategoryDependencies } from "./category.dependencies";
import { createCourseDependencies } from "./course.dependencies";
import { createInstructorDependencies } from "./instructor.dipendencies";
import { createSharedDependencies } from "./shared.dependencies";
import { createUserDependencies } from "./user.dependencies";
import { LessonContentController } from "../presentation/http/controllers/content.controller";
import { createLessonDependencies } from "./lesson.depenedencies";
import { createLessonContentDependencies } from "./content.dependencies";

export interface AppDependencies {
  authController: AuthController;
  userController: UserController;
  instructorController: InstructorController;
  categoryController: CategoryController;
  courseController: CourseController;
  lessonController: LessonController;
  lessonContentController: LessonContentController;
}

export function createAppDependencies(): AppDependencies {
  const sharedDeps = createSharedDependencies();

  const { authController } = createAuthDependencies(sharedDeps);
  const { userController } = createUserDependencies(sharedDeps);
  const { instructorController } = createInstructorDependencies(sharedDeps);
  const { categoryController } = createCategoryDependencies(sharedDeps);
  const { courseController } = createCourseDependencies(sharedDeps);
  const { lessonController } = createLessonDependencies(sharedDeps);
  const { lessonContentController } =
    createLessonContentDependencies(sharedDeps);

  return {
    authController,
    userController,
    instructorController,
    categoryController,
    courseController,
    lessonController,
    lessonContentController,
  };
}
