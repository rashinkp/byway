import { AuthController } from "../presentation/http/controllers/auth.controller";
import { CategoryController } from "../presentation/http/controllers/category.controller";
import { CourseController } from "../presentation/http/controllers/course.controller";
import { InstructorController } from "../presentation/http/controllers/instructor.controller";
import { UserController } from "../presentation/http/controllers/user.controller";
import { createAuthDependencies } from "./auth.dependencies";
import { createCategoryDependencies } from "./category.dependencies";
import { createCourseDependencies } from "./course.dependencies";
import { createInstructorDependencies } from "./instructor.dipendencies";
import { createUserDependencies } from "./user.dependencies";

export interface AppDependencies {
  authController: AuthController;
  userController: UserController;
  instructorController: InstructorController;
  categoryController: CategoryController;
  courseController: CourseController;
}

export function createAppDependencies(): AppDependencies {
  const { authController } = createAuthDependencies();
  const { userController } = createUserDependencies();
  const { instructorController } = createInstructorDependencies();
  const { categoryController } = createCategoryDependencies();
  const { courseController } = createCourseDependencies();

  return {
    authController,
    userController,
    instructorController,
    categoryController,
    courseController,
  };
}
