import { prismaClient } from "../infra/prisma/client";
import { UserRepository } from "../infra/repositories/user.repository.impl";
import { CategoryRepository } from "../infra/repositories/category.repository.impl";
import { CourseRepository } from "../infra/repositories/course.repository.impl";
import { InstructorRepository } from "../infra/repositories/instructor.repository.impl";
import { AuthRepository } from "../infra/repositories/auth.repository.impl";
import { EnrollmentRepository } from "../infra/repositories/enrollment.repository.impl";
import { OtpProvider } from "../infra/providers/otp/otp.provider";
import { GoogleAuthProvider } from "../infra/providers/auth/google-auth.provider";
import { envConfig } from "../presentation/express/configs/env.config";
import { IUserRepository } from "../app/repositories/user.repository";
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
  otpProvider: OtpProvider;
  googleAuthProvider: GoogleAuthProvider;
  httpErrors: HttpErrors;
  httpSuccess: HttpSuccess;
  cookieService: CookieService;
  walletRepository: IWalletRepository;
}

export function createSharedDependencies(): SharedDependencies {
  const userRepository = new UserRepository(prismaClient);
  const categoryRepository = new CategoryRepository(prismaClient);
  const courseRepository = new CourseRepository(prismaClient);
  const instructorRepository = new InstructorRepository(prismaClient);
  const authRepository = new AuthRepository(prismaClient);
  const enrollmentRepository = new EnrollmentRepository(prismaClient);
  const lessonRepository = new LessonRepository(prismaClient);
  const lessonContentRepository = new LessonContentRepository(prismaClient);
  const cartRepository = new CartRepository(prismaClient);
  const orderRepository = new OrderRepository(prismaClient);
  const transactionRepository = new TransactionRepository(prismaClient);
  const otpProvider = new OtpProvider(authRepository);
  const googleAuthProvider = new GoogleAuthProvider(envConfig.GOOGLE_CLIENT_ID);
  const walletRepository = new WalletRepository(prismaClient);

  const httpErrors = new HttpErrors();
  const httpSuccess = new HttpSuccess();
  const cookieService = new CookieService();

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
    otpProvider,
    googleAuthProvider,
    httpErrors,
    httpSuccess,
    cookieService,
    walletRepository,
  };
}
