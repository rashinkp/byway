import { prismaClient } from "../infra/prisma/client";
import { UserRepository } from "../infra/repositories/implementations/user.repository.impl";
import { CategoryRepository } from "../infra/repositories/implementations/category.repository.impl";
import { CourseRepository } from "../infra/repositories/implementations/course.repository.impl";
import { InstructorRepository } from "../infra/repositories/implementations/instructor.repository.impl";
import { AuthRepository } from "../infra/repositories/implementations/auth.repository.impl";
import { EnrollmentRepository } from "../infra/repositories/implementations/enrollment.repository.impl";
import { OtpProvider } from "../infra/providers/otp/otp.provider";
import { GoogleAuthProvider } from "../infra/providers/auth/google-auth.provider";
import { envConfig } from "../presentation/express/configs/env.config";

export interface SharedDependencies {
  userRepository: UserRepository;
  categoryRepository: CategoryRepository;
  courseRepository: CourseRepository;
  instructorRepository: InstructorRepository;
  authRepository: AuthRepository;
  enrollmentRepository: EnrollmentRepository;
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
