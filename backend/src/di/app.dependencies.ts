import { createSharedDependencies } from "./shared.dependencies";
import { createAuthDependencies } from "./auth.dependencies";
import { createUserDependencies } from "./user.dependencies";
import { createInstructorDependencies } from "./instructor.dipendencies";
import { createCategoryDependencies } from "./category.dependencies";
import { createCourseDependencies } from "./course.dependencies";
import { createLessonDependencies } from "./lesson.depenedencies";
import { createLessonContentDependencies } from "./content.dependencies";
import { createCartDependencies } from "./cart.dependencies";
import { createStripeDependencies } from "./stripe.dependencies";
import { createTransactionDependencies } from "./transaction.dependencies";
import { createOrderDependencies } from "./order.dependencies";
import { createFileDependencies } from "./file.dependencies";
import { createProgressDependencies } from "./progress.dependencies";

export interface AppDependencies {
  authController: any;
  userController: any;
  instructorController: any;
  categoryController: any;
  courseController: any;
  lessonController: any;
  lessonContentController: any;
  cartController: any;
  stripeController: any;
  transactionController: any;
  orderController: any;
  fileController: any;
  progressController: any;
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
  const transactionDeps = createTransactionDependencies(sharedDeps);
  const orderDeps = createOrderDependencies(sharedDeps);
  const fileDeps = createFileDependencies(sharedDeps);
  const progressDeps = createProgressDependencies(sharedDeps);

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
    transactionController: transactionDeps.transactionController,
    orderController: orderDeps.orderController,
    fileController: fileDeps.fileController,
    progressController: progressDeps.progressController
  };
}
