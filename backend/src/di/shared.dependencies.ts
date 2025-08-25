import { prismaClient } from "../infra/prisma/client";
import { PrismaInstructorRepository } from "../infra/repositories/instructor.repository.impl";
import { UserRepository } from "../infra/repositories/user.repository.impl";
import { CategoryRepository } from "../infra/repositories/category.repository.impl";
import { CourseRepository } from "../infra/repositories/course.repository.impl";
import { AuthRepository } from "../infra/repositories/auth.repository.impl";
import { EnrollmentRepository } from "../infra/repositories/enrollment.repository.impl";
import { OtpProvider } from "../infra/providers/otp/otp.provider";
import { GoogleAuthProvider } from "../infra/providers/auth/google-auth.provider";
import { envConfig } from "../presentation/express/configs/env.config";
import { ICategoryRepository } from "../app/repositories/category.repository";
import { ICourseRepository } from "../app/repositories/course.repository.interface";
import { IInstructorRepository } from "../app/repositories/instructor.repository";
import { IAuthRepository } from "../app/repositories/auth.repository";
import { IEnrollmentRepository } from "../app/repositories/enrollment.repository.interface";
import { ILessonRepository } from "../app/repositories/lesson.repository";
import { HttpErrors } from "../presentation/http/http.errors";
import { HttpSuccess } from "../presentation/http/http.success";
import { CookieService } from "../presentation/http/utils/cookie.service";
import { LessonRepository } from "../infra/repositories/lesson.repository.impl";
import { LessonContentRepository } from "../infra/repositories/content.repository";
import { ILessonContentRepository } from "../app/repositories/content.repository";
import { CartRepository } from "../infra/repositories/cart.repository.impl";
import { ICartRepository } from "../app/repositories/cart.repository";
import { OrderRepository } from "../infra/repositories/order.repository.impl";
import { IOrderRepository } from "../app/repositories/order.repository";
import { TransactionRepository } from "../infra/repositories/transaction.repository.impl";
import { ITransactionRepository } from "../app/repositories/transaction.repository";
import { IWalletRepository } from "../app/repositories/wallet.repository.interface";
import { WalletRepository } from "../infra/repositories/wallet.repository";
import { StripePaymentGateway } from "../infra/providers/stripe/stripe-payment.gateway";
import { StripeWebhookGateway } from "../infra/providers/stripe/stripe-webhook.gateway";
import { PrismaRevenueRepository } from "../infra/repositories/revenue.repository";
import { IRevenueRepository } from "../app/repositories/revenue.repository";
import { CourseReviewRepository } from "../infra/repositories/course-review.repository.impl";
import { ICourseReviewRepository } from "../app/repositories/course-review.repository.interface";
import { LessonProgressRepository } from "../infra/repositories/lesson-progress.repository.impl";
import { ILessonProgressRepository } from "../app/repositories/lesson-progress.repository.interface";
import { PrismaCertificateRepository } from "../infra/repositories/certificate-repository";
import { CertificateRepositoryInterface } from "../app/repositories/certificate-repository.interface";
import { S3Service } from "../infra/providers/s3/s3.service";
import { EmailProviderImpl } from "../infra/providers/email/email.provider";
import { GetEnrollmentStatsUseCase } from "../app/usecases/enrollment/implementations/get-enrollment-stats.usecase";
import { IUserRepository } from "../app/repositories/user.repository";
import { IPasswordHasher } from "../app/providers/password-hasher.interface";
import { BcryptPasswordHasher } from "../infra/providers/password-hasher.ts";
import { ChatRepository } from "../infra/repositories/chat.repository.impl";
import { IChatRepository } from "../app/repositories/chat.repository.interface";
import { IMessageRepository } from "../app/repositories/message.repository.interface";
import { MessageRepository } from "../infra/repositories/message.repository.impl";
import { WinstonLogger } from "../infra/providers/logging/winston.logger";
import { ILogger } from "../app/providers/logger-provider.interface";

export interface SharedDependencies {
  prisma: typeof prismaClient;
  userRepository: IUserRepository;
  categoryRepository: ICategoryRepository;
  courseRepository: ICourseRepository;
  instructorRepository: IInstructorRepository;
  authRepository: IAuthRepository;
  enrollmentRepository: IEnrollmentRepository;
  lessonRepository: ILessonRepository;
  lessonContentRepository: ILessonContentRepository;
  cartRepository: ICartRepository;
  orderRepository: IOrderRepository;
  transactionRepository: ITransactionRepository;
  revenueRepository: IRevenueRepository;
  courseReviewRepository: ICourseReviewRepository;
  otpProvider: OtpProvider;
  googleAuthProvider: GoogleAuthProvider;
  httpErrors: HttpErrors;
  httpSuccess: HttpSuccess;
  cookieService: CookieService;
  walletRepository: IWalletRepository;
  paymentGateway: StripePaymentGateway;
  webhookGateway: StripeWebhookGateway;
  lessonProgressRepository: ILessonProgressRepository;
  certificateRepository: CertificateRepositoryInterface;
  s3Service: S3Service;
  emailProvider: EmailProviderImpl;
  getEnrollmentStatsUseCase: GetEnrollmentStatsUseCase;
  passwordHasher: IPasswordHasher;
  chatRepository: IChatRepository;
  messageRepository: IMessageRepository;
  logger: ILogger;
}

export function createSharedDependencies(): SharedDependencies {
  const userRepository = new UserRepository(prismaClient);
  const categoryRepository = new CategoryRepository(prismaClient);
  const courseRepository = new CourseRepository(prismaClient);
  const instructorRepository = new PrismaInstructorRepository(prismaClient);
  const authRepository = new AuthRepository(prismaClient);
  const enrollmentRepository = new EnrollmentRepository(prismaClient);
  const lessonRepository = new LessonRepository(prismaClient);
  const lessonContentRepository = new LessonContentRepository(prismaClient);
  const cartRepository = new CartRepository(prismaClient);
  const orderRepository = new OrderRepository(prismaClient);
  const transactionRepository = new TransactionRepository(prismaClient);
  const courseReviewRepository = new CourseReviewRepository(prismaClient);
  const logger = new WinstonLogger();
  const s3Service = new S3Service(logger);
  const emailProvider = new EmailProviderImpl();
  const otpProvider = new OtpProvider(authRepository, emailProvider);
  const googleAuthProvider = new GoogleAuthProvider(envConfig.GOOGLE_CLIENT_ID);
  const walletRepository = new WalletRepository(prismaClient);
  const paymentGateway = new StripePaymentGateway();
  const webhookGateway = new StripeWebhookGateway();
  const passwordHasher = new BcryptPasswordHasher();
  const chatRepository = new ChatRepository(prismaClient);
  const messageRepository = new MessageRepository(prismaClient);



  const httpErrors = new HttpErrors();
  const httpSuccess = new HttpSuccess();
  const cookieService = new CookieService();

  const revenueRepository = new PrismaRevenueRepository(prismaClient)
  const lessonProgressRepository = new LessonProgressRepository(prismaClient);
  const certificateRepository = new PrismaCertificateRepository(prismaClient);

  const getEnrollmentStatsUseCase = new GetEnrollmentStatsUseCase(
    enrollmentRepository
  );

  return {
    prisma: prismaClient,
    userRepository,
    categoryRepository,
    courseRepository,
    instructorRepository,
    authRepository,
    enrollmentRepository,
    lessonRepository,
    lessonContentRepository,
    cartRepository,
    orderRepository,
    transactionRepository,
    revenueRepository,
    courseReviewRepository,
    otpProvider,
    googleAuthProvider,
    httpErrors,
    httpSuccess,
    cookieService,
    walletRepository,
    paymentGateway,
    webhookGateway,
    lessonProgressRepository,
    certificateRepository,
    s3Service,
    emailProvider,
    getEnrollmentStatsUseCase,
    passwordHasher,
    chatRepository,
    messageRepository,
    logger
  };
}
