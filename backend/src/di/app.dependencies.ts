import { createSharedDependencies } from "./shared.dependencies";
import { createAuthDependencies } from "./auth.dependencies";
import { createUserDependencies } from "./user.dependencies";
import { createInstructorDependencies } from "./instructor.dependencies";
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
import { createCourseReviewDependencies } from "./course-review.dependencies";
import { SearchRepository } from "../infra/repositories/search.repository.impl";
import { GlobalSearchUseCase } from "../app/usecases/search/implementation/global-search.usecase";
import { SearchController } from "../presentation/http/controllers/search.controller";
import { searchRouter } from "../presentation/express/router/search.router";
import { createWalletDependencies } from "./wallet.dependencies";
import { createRevenueDependencies } from "./revenue.dependencies";
import { revenueRouter } from "../presentation/express/router/revenue.router";
import { createDashboardDependencies } from "./dashboard.dependencies";
import { dashboardRouter } from "../presentation/express/router/dashboard.router";
import courseReviewRouter from "../presentation/express/router/course-review.router";

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
  searchController: any;
  searchRouter: any;
  walletController: any;
  revenueController: any;
  revenueRouter: any;
  dashboardController: any;
  dashboardRouter: any;
  courseReviewController: any;
  courseReviewRouter: any;
}

export function createAppDependencies(): AppDependencies {
  const sharedDeps = createSharedDependencies();
  const { prisma, httpErrors, httpSuccess } = sharedDeps;

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
  const courseReviewDeps = createCourseReviewDependencies(sharedDeps);
  const walletDeps = createWalletDependencies(sharedDeps);
  const revenueDeps = createRevenueDependencies(sharedDeps);
  const dashboardDeps = createDashboardDependencies(sharedDeps);

  const searchRepository = new SearchRepository(prisma);
  const globalSearchUseCase = new GlobalSearchUseCase(searchRepository);
  const searchController = new SearchController(
    globalSearchUseCase,
    httpErrors,
    httpSuccess
  );

  const searchRouterInstance = searchRouter(searchController);
  const revenueRouterInstance = revenueRouter(revenueDeps.revenueController);
  const dashboardRouterInstance = dashboardRouter(
    dashboardDeps.dashboardController
  );
  const courseReviewRouterInstance = courseReviewRouter(courseReviewDeps.courseReviewController);

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
    progressController: progressDeps.progressController,
    searchController,
    searchRouter: searchRouterInstance,
    walletController: walletDeps.walletController,
    revenueController: revenueDeps.revenueController,
    revenueRouter: revenueRouterInstance,
    dashboardController: dashboardDeps.dashboardController,
    dashboardRouter: dashboardRouterInstance,
    courseReviewController: courseReviewDeps.courseReviewController,
    courseReviewRouter: courseReviewRouterInstance,
  };
}
