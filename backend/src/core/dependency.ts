import { PrismaClient } from "@prisma/client";
import { AuthController } from "../modules/auth/auth.controller";
import { AuthService } from "../modules/auth/auth.service";
import { AuthRepository } from "../modules/auth/auth.repository";
import { InstructorController } from "../modules/instructor/instructor.controller";
import { InstructorRepository } from "../modules/instructor/instructor.repository";
import { InstructorService } from "../modules/instructor/instructor.service";
import { UserService } from "../modules/user/user.service";
import { UserController } from "../modules/user/user.controller";
import { UserRepository } from "../modules/user/user.repository";
import { OtpRepository } from "../modules/otp/otp.repository";
import { OtpService } from "../modules/otp/otp.service";
import { OtpController } from "../modules/otp/otp.controller";
import { CategoryRepository } from "../modules/category/category.repository";
import { CategoryService } from "../modules/category/category.service";
import { CategoryController } from "../modules/category/category.controller";
import { CourseRepository } from "../modules/course/course.repository";
import { CourseService } from "../modules/course/course.service";
import { CourseController } from "../modules/course/course.controller";
import { LessonRepository } from "../modules/lesson/lesson.repository";
import { LessonService } from "../modules/lesson/lesson.service";
import { LessonController } from "../modules/lesson/lesson.controller";

export const initializeDependencies = () => {
  const prisma = new PrismaClient();

  //otp related dependancies
  const otpRepository = new OtpRepository(prisma);
  const otpService = new OtpService(otpRepository);
  const otpController = new OtpController(otpService);

  const authRepository = new AuthRepository(prisma);
  const authService = new AuthService(authRepository, otpService);
  const authController = new AuthController(authService);

  const instructorRepository = new InstructorRepository(prisma);
  const instructorService = new InstructorService(instructorRepository);
  const instructorController = new InstructorController(instructorService);

  //user dependancy
  const userRepository = new UserRepository(prisma);
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  //category related dependancy

  const categoryRepository = new CategoryRepository(prisma);
  const categoryService = new CategoryService(categoryRepository);
  const categoryController = new CategoryController(categoryService);

  const courseRepository = new CourseRepository(prisma);
  const courseService = new CourseService(courseRepository, categoryRepository);
  const courseController = new CourseController(courseService);

  //lesson based
  const lessonRepository = new LessonRepository(prisma);
  const lessonService = new LessonService(
    lessonRepository,
    courseRepository,
    prisma
  );
  const lessonController = new LessonController(lessonService);

  return {
    authController,
    instructorController,
    userController,
    otpController,
    categoryController,
    courseController,
    lessonController,
  };
};
