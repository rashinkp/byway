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

export interface SharedDependencies {
  userRepository: IUserRepository;
  categoryRepository: ICategoryRepository;
  courseRepository: ICourseRepository;
  instructorRepository: IInstructorRepository;
  authRepository: IAuthRepository;
  enrollmentRepository: IEnrollmentRepository;
  otpProvider: OtpProvider;
  googleAuthProvider: GoogleAuthProvider;
}

export function createSharedDependencies(): SharedDependencies {
  const userRepository = new UserRepository(prismaClient);
  const categoryRepository = new CategoryRepository(prismaClient);
  const courseRepository = new CourseRepository(prismaClient);
  const instructorRepository = new InstructorRepository(prismaClient);
  const authRepository = new AuthRepository(prismaClient);
  const enrollmentRepository = new EnrollmentRepository(prismaClient);
  const otpProvider = new OtpProvider(authRepository);
  const googleAuthProvider = new GoogleAuthProvider(envConfig.GOOGLE_CLIENT_ID);

  return {
    userRepository,
    categoryRepository,
    courseRepository,
    instructorRepository,
    authRepository,
    enrollmentRepository,
    otpProvider,
    googleAuthProvider,
  };
}
