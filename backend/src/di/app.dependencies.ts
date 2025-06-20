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
import { createChatDependencies } from "./chat.dependencies";
import { createNotificationDependencies } from "./notification.dependencies";
import { createCertificateDependencies } from "./certificate.dependencies";
import { CertificateController } from "../presentation/http/controllers/certificate.controller";
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
  chatController: any;
  sendMessageUseCase: any;
  createChatUseCase: any;
  messageRepository: any;
  httpErrors: any;
  httpSuccess: any;
  getUserNotificationsUseCase: any;
  notificationController: any;
  createNotificationsForUsersUseCase: any;
  courseRepository: any;
  categoryRepository: any;
  userRepository: any;
  enrollmentRepository: any;
  cartRepository: any;
  courseReviewRepository: any;
  lessonRepository: any;
  certificateController: CertificateController;
}

export function createAppDependencies(): AppDependencies {
  const notificationDeps = createNotificationDependencies(createSharedDependencies());
  const shared = createSharedDependencies(notificationDeps.createNotificationsForUsersUseCase);
  const { prisma, httpErrors, httpSuccess } = shared;

  const authDeps = createAuthDependencies(shared);
  const userDeps = createUserDependencies(shared);
  const instructorDeps = createInstructorDependencies(shared);
  const categoryDeps = createCategoryDependencies(shared);
  const courseDeps = createCourseDependencies({
    ...shared,
    createNotificationsForUsersUseCase: notificationDeps.createNotificationsForUsersUseCase,
  });
  const lessonDeps = createLessonDependencies(shared);
  const lessonContentDeps = createLessonContentDependencies(shared);
  const cartDeps = createCartDependencies(shared);
  const stripeDeps = createStripeDependencies(shared);
  const transactionDeps = createTransactionDependencies(shared);
  const orderDeps = createOrderDependencies(shared);
  const fileDeps = createFileDependencies(shared);
  const progressDeps = createProgressDependencies(shared);
  const courseReviewDeps = createCourseReviewDependencies(shared);
  const walletDeps = createWalletDependencies(shared);
  const revenueDeps = createRevenueDependencies(shared);
  const dashboardDeps = createDashboardDependencies(shared);
  const chatDeps = createChatDependencies(shared);

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

  // Certificate dependencies
  const certificateDeps = createCertificateDependencies(
    shared,
    shared.certificateRepository,
    shared.enrollmentRepository,
    shared.courseRepository,
    shared.userRepository,
    shared.lessonProgressRepository
  );

  return {
    ...shared,
    ...notificationDeps,
    ...courseDeps,
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
    chatController: chatDeps.chatController,
    sendMessageUseCase: chatDeps.sendMessageUseCase,
    createChatUseCase: chatDeps.createChatUseCase,
    messageRepository: chatDeps.messageRepository,
    getUserNotificationsUseCase: notificationDeps.getUserNotificationsUseCase,
    notificationController: notificationDeps.notificationController,
    createNotificationsForUsersUseCase: notificationDeps.createNotificationsForUsersUseCase,
    courseRepository: shared.courseRepository,
    categoryRepository: shared.categoryRepository,
    userRepository: shared.userRepository,
    enrollmentRepository: shared.enrollmentRepository,
    cartRepository: shared.cartRepository,
    courseReviewRepository: shared.courseReviewRepository,
    lessonRepository: shared.lessonRepository,
    certificateController: certificateDeps.certificateController,
  };
}
