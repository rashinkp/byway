import { AuthController } from "../presentation/http/controllers/auth.controller";
import { CategoryController } from "../presentation/http/controllers/category.controller";
import { InstructorController } from "../presentation/http/controllers/instructor.controller";
import { UserController } from "../presentation/http/controllers/user.controller";
import { createAuthDependencies } from "./auth.dependencies";
import { createCategoryDependencies } from "./category.dependencies";
import { createInstructorDependencies } from "./instructor.dipendencies";
import { createUserDependencies } from "./user.dependencies";

export interface AppDependencies {
  authController: AuthController;
  userController: UserController;
  instructorController: InstructorController;
  categoryController:CategoryController
}

export function createAppDependencies(): AppDependencies {
  const { authController } = createAuthDependencies();
  const { userController } = createUserDependencies();
  const { instructorController } = createInstructorDependencies();
  const { categoryController} = createCategoryDependencies();

  return {
    authController,
    userController,
    instructorController,
    categoryController
  };
}
