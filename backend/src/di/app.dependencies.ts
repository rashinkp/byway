import { createSharedDependencies } from "./shared.dependencies";
import { createAuthDependencies } from "./auth.dependencies";
import { createUserDependencies } from "./user.dependencies";
import { createInstructorDependencies } from "./instructor.dependencies";
import { createCategoryDependencies } from "./category.dependencies";
import { createCourseDependencies } from "./course.dependencies";
import { createLessonDependencies } from "./lesson.dependencies";
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
import { AuthController } from "../presentation/http/controllers/auth.controller";
import { UserController } from "../presentation/http/controllers/user.controller";
import { InstructorController } from "../presentation/http/controllers/instructor.controller";
import { CategoryController } from "../presentation/http/controllers/category.controller";
import { CourseController } from "../presentation/http/controllers/course.controller";
import { LessonController } from "../presentation/http/controllers/lesson.controller";
import { CartController } from "../presentation/http/controllers/cart.controller";
import { StripeController } from "../presentation/http/controllers/stripe.controller";
import { TransactionController } from "../presentation/http/controllers/transaction.controller";
import { OrderController } from "../presentation/http/controllers/order.controller";
import { FileController } from "../presentation/http/controllers/file.controller";
import { ProgressController } from "../presentation/http/controllers/progress.controller";
import { SearchController } from "../presentation/http/controllers/search.controller";
import { WalletController } from "../presentation/http/controllers/wallet.controller";
import { RevenueController } from "../presentation/http/controllers/revenue.controller";
import { DashboardController } from "../presentation/http/controllers/dashboard.controller";
import { CourseReviewController } from "../presentation/http/controllers/course-review.controller";
import { ChatController } from "../presentation/http/controllers/chat.controller";
import { NotificationController } from "../presentation/http/controllers/notification.controller";
import { CreateNotificationsForUsersUseCase } from "../app/usecases/notification/implementations/create-notifications-for-users.usecase";
import { GetUserNotificationsUseCase } from "../app/usecases/notification/implementations/get-user-notifications.usecase";
import { HttpErrors } from "../presentation/http/http.errors";
import { HttpSuccess } from "../presentation/http/http.success";
import { ICourseRepository } from "../app/repositories/course.repository.interface";
import { ICategoryRepository } from "../app/repositories/category.repository";
import { IUserRepository } from "../app/repositories/user.repository";
import { IEnrollmentRepository } from "../app/repositories/enrollment.repository.interface";
import { ICartRepository } from "../app/repositories/cart.repository";
import { ICourseReviewRepository } from "../app/repositories/course-review.repository.interface";
import { ILessonRepository } from "../app/repositories/lesson.repository";
import { Router } from "express";
import { RevenueDistributionService } from "../app/services/revenue-distribution/implementations/revenue-distribution.service";
import { PaymentService } from "../app/services/payment/implementations/payment.service";
import { GetTotalUnreadCountUseCase } from "../app/usecases/message/implementations/get-total-unread-count.usecase";
import { CheckUserActiveUseCase } from "../app/usecases/user/implementations/check-user-active.usecase";
import { LessonContentController } from "../presentation/http/controllers/content.controller";
import { SendMessageUseCase } from "../app/usecases/message/implementations/send-message.usecase";
import { CreateChatUseCase } from "../app/usecases/chat/implementations/create-chat.usecase";
import { IMessageRepository } from "../app/repositories/message.repository.interface";

export interface AppDependencies {
  authController: AuthController;
  userController: UserController;
  checkUserActiveUseCase: CheckUserActiveUseCase;
  instructorController: InstructorController;
  categoryController: CategoryController;
  courseController: CourseController;
  lessonController: LessonController;
  lessonContentController: LessonContentController;
  cartController: CartController;
  stripeController: StripeController;
  transactionController: TransactionController;
  orderController: OrderController;
  fileController: FileController;
  progressController: ProgressController;
  searchController: SearchController;
  searchRouter: Router;
  walletController: WalletController;
  revenueController: RevenueController;
  revenueRouter: Router;
  dashboardController: DashboardController;
  dashboardRouter: Router;
  courseReviewController: CourseReviewController;
  courseReviewRouter: Router;
  chatController: ChatController;
  sendMessageUseCase: SendMessageUseCase;
  createChatUseCase: CreateChatUseCase;
  messageRepository: IMessageRepository;
  httpErrors: HttpErrors;
  httpSuccess: HttpSuccess;
  getUserNotificationsUseCase: GetUserNotificationsUseCase;
  notificationController: NotificationController;
  createNotificationsForUsersUseCase: CreateNotificationsForUsersUseCase;
  courseRepository: ICourseRepository;
  categoryRepository: ICategoryRepository;
  userRepository: IUserRepository;
  enrollmentRepository: IEnrollmentRepository;
  cartRepository: ICartRepository;
  courseReviewRepository: ICourseReviewRepository;
  lessonRepository: ILessonRepository;
  certificateController: CertificateController;
  getTotalUnreadCountUseCase: GetTotalUnreadCountUseCase;
}

export function createAppDependencies(): AppDependencies {
  const shared = createSharedDependencies();
  const notificationDeps = createNotificationDependencies(shared);
  const { prisma, httpErrors, httpSuccess } = shared;

  // Create the real RevenueDistributionService
  const revenueDistributionService = new RevenueDistributionService(
    shared.walletRepository,
    shared.transactionRepository,
    shared.orderRepository,
    shared.userRepository,
    notificationDeps.createNotificationsForUsersUseCase
  );

  // Create the real PaymentService
  const paymentService = new PaymentService(
    shared.walletRepository,
    shared.orderRepository,
    shared.transactionRepository,
    shared.enrollmentRepository,
    shared.paymentGateway,
    shared.webhookGateway,
    shared.userRepository,
    revenueDistributionService,
    shared.cartRepository
  );

  // Override the paymentService in shared
  shared.paymentService = paymentService;

  const authDeps = createAuthDependencies(shared);
  const userDeps = createUserDependencies(
    shared,
    notificationDeps.createNotificationsForUsersUseCase
  );
  const instructorDeps = createInstructorDependencies(
    shared,
    notificationDeps.createNotificationsForUsersUseCase
  );
  const categoryDeps = createCategoryDependencies(shared);
  const courseDeps = createCourseDependencies(
    shared,
    notificationDeps.createNotificationsForUsersUseCase
  );
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
  const courseReviewRouterInstance = courseReviewRouter(
    courseReviewDeps.courseReviewController
  );

  // Certificate dependencies
  const certificateDeps = createCertificateDependencies(
    shared,
    shared.certificateRepository,
    shared.enrollmentRepository,
    shared.courseRepository,
    shared.userRepository,
    shared.lessonProgressRepository,
    shared.lessonRepository
  );

  return {
    ...shared,
    ...notificationDeps,
    ...courseDeps,
    authController: authDeps.authController,
    userController: userDeps.userController,
    checkUserActiveUseCase: userDeps.checkUserActiveUseCase,
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
    createNotificationsForUsersUseCase:
      notificationDeps.createNotificationsForUsersUseCase,
    courseRepository: shared.courseRepository,
    categoryRepository: shared.categoryRepository,
    userRepository: shared.userRepository,
    enrollmentRepository: shared.enrollmentRepository,
    cartRepository: shared.cartRepository,
    courseReviewRepository: shared.courseReviewRepository,
    lessonRepository: shared.lessonRepository,
    certificateController: certificateDeps.certificateController,
    getTotalUnreadCountUseCase: chatDeps.getTotalUnreadCountUseCase,
  };
}

let appDependenciesSingleton: AppDependencies | null = null;
export function getAppDependencies(): AppDependencies {
  if (!appDependenciesSingleton) {
    appDependenciesSingleton = createAppDependencies();
  }
  return appDependenciesSingleton;
}
