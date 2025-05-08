import { IDatabaseProvider } from "../database";
import { initializeAuthDependencies, AuthDependencies } from "./authDependancy";
import {
  initializeUserDependencies,
  UserDependencies,
} from "./userDependencies";
import {
  initializeInstructorDependencies,
  InstructorDependencies,
} from "./instructorDependencies";
import { initializeOtpDependencies, OtpDependencies } from "./otpDependencies";
import {
  initializeCategoryDependencies,
  CategoryDependencies,
} from "./categoryDependencies";
import {
  initializeCourseDependencies,
  CourseDependencies,
} from "./courseDependencies";
import {
  initializeLessonDependencies,
  LessonDependencies,
} from "./lessonDependencies";
import {
  ContentDependencies,
  initializeContentDependencies,
} from "./contentDependancy";
import {
  CartDependencies,
  initializeCartDependencies,
} from "./cart.dependencies";
import {
  EnrollmentDependencies,
  initializeEnrollmentDependencies,
} from "./enrollmentDependencies";
import { initializeTransactionHistoryDependencies, TransactionHistoryDependencies } from "./transactionDependacies";
import { initializeOrderDependencies, OrderDependencies } from "./orderDependencies";
import { initializePaypalDependencies, PaypalDependencies } from "./paypalDependencies";

export interface AppDependencies {
  authController: AuthDependencies["authController"];
  userController: UserDependencies["userController"];
  instructorController: InstructorDependencies["instructorController"];
  otpController: OtpDependencies["otpController"];
  categoryController: CategoryDependencies["categoryController"];
  courseController: CourseDependencies["courseController"];
  lessonController: LessonDependencies["lessonController"];
  contentController: ContentDependencies["contentController"];
  cartController: CartDependencies["cartController"];
  enrollmentController: EnrollmentDependencies["enrollmentController"];
  orderController: OrderDependencies["orderController"];
  transactionHistoryController: TransactionHistoryDependencies["transactionHistoryController"];
  paypalController: PaypalDependencies["paypalController"];
}

export const initializeAppDependencies = (
  dbProvider: IDatabaseProvider
): AppDependencies => {
  const userDeps = initializeUserDependencies(dbProvider);
  const otpDeps = initializeOtpDependencies(dbProvider);
  const authDeps = initializeAuthDependencies(
    dbProvider,
    otpDeps.otpService,
    userDeps.userService
  );
  const instructorDeps = initializeInstructorDependencies(
    dbProvider,
    userDeps.userService
  );
  const categoryDeps = initializeCategoryDependencies(
    dbProvider,
    userDeps.userService
  );
  const courseDeps = initializeCourseDependencies(
    dbProvider,
    categoryDeps.categoryService,
    userDeps.userService
  );
  const lessonDeps = initializeLessonDependencies(
    dbProvider,
    courseDeps.courseRepository
  );
  const contentDeps = initializeContentDependencies(
    dbProvider,
    lessonDeps.lessonService,
    courseDeps.courseService
  );
  const cartDeps = initializeCartDependencies(
    dbProvider,
    userDeps.userService,
    courseDeps.courseService
  );
  const enrollmentDeps = initializeEnrollmentDependencies(
    dbProvider,
    userDeps.userService,
    courseDeps.courseService
  );
  const orderDeps = initializeOrderDependencies(
    dbProvider,
    userDeps.userService,
    courseDeps.courseService,
  );

   const transactionHistoryDeps = initializeTransactionHistoryDependencies(
     dbProvider,
     orderDeps.orderService,
     userDeps.userService
   );

    const paypalDeps = initializePaypalDependencies(
      dbProvider,
      userDeps.userService
  );
  

  // Inject dependent services to break circular dependency
  enrollmentDeps.setPaymentService(orderDeps.orderService);
  orderDeps.setEnrollmentService(enrollmentDeps.enrollmentService);

  return {
    authController: authDeps.authController,
    userController: userDeps.userController,
    instructorController: instructorDeps.instructorController,
    otpController: otpDeps.otpController,
    categoryController: categoryDeps.categoryController,
    courseController: courseDeps.courseController,
    lessonController: lessonDeps.lessonController,
    contentController: contentDeps.contentController,
    cartController: cartDeps.cartController,
    enrollmentController: enrollmentDeps.enrollmentController,
    orderController: orderDeps.orderController,
    transactionHistoryController:
      transactionHistoryDeps.transactionHistoryController,
    paypalController: paypalDeps.paypalController,
  };
};
