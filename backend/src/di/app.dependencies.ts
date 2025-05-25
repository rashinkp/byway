import { AuthController } from "../presentation/http/controllers/auth.controller";
import { CategoryController } from "../presentation/http/controllers/category.controller";
import { CourseController } from "../presentation/http/controllers/course.controller";
import { InstructorController } from "../presentation/http/controllers/instructor.controller";
import { UserController } from "../presentation/http/controllers/user.controller";
import { LessonController } from "../presentation/http/controllers/lesson.controller";
import { createAuthDependencies } from "./auth.dependencies";
import { createCategoryDependencies } from "./category.dependencies";
import { createCourseDependencies } from "./course.dependencies";
import { createSharedDependencies } from "./shared.dependencies";
import { createUserDependencies } from "./user.dependencies";
import { LessonContentController } from "../presentation/http/controllers/content.controller";
import { CartController } from "../presentation/http/controllers/cart.controller";
import { createCartDependencies } from "./cart.dependencies";
import { createStripeDependencies } from "./stripe.dependencies";
import { createInstructorDependencies } from "./instructor.dipendencies";
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
  cartController: CartController;
  stripeController: any;
}

export function createAppDependencies(): AppDependencies {
  const sharedDeps = createSharedDependencies();

  const authDeps = createAuthDependencies(sharedDeps);
  const userDeps = createUserDependencies(sharedDeps);
  const instructorDeps = createInstructorDependencies(sharedDeps);
  const categoryDeps = createCategoryDependencies(sharedDeps);
  const courseDeps = createCourseDependencies(sharedDeps);
  const lessonDeps = createLessonDependencies(sharedDeps);
  const lessonContentDeps = createLessonContentDependencies(sharedDeps);
  const cartDeps = createCartDependencies(sharedDeps);
  const stripeDeps = createStripeDependencies(sharedDeps);

  return {
    authController: authDeps.authController,
    userController: userDeps.userController,
    instructorController: instructorDeps.instructorController,
    categoryController: categoryDeps.categoryController,
    courseController: courseDeps.courseController,
    lessonController: lessonDeps.lessonController,
    lessonContentController: lessonContentDeps.lessonContentController,
    cartController: cartDeps.cartController,
    stripeController: stripeDeps.stripeController,
  };
}
