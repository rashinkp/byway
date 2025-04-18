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

export interface AppDependencies {
  authController: AuthDependencies["authController"];
  userController: UserDependencies["userController"];
  instructorController: InstructorDependencies["instructorController"];
  otpController: OtpDependencies["otpController"];
  categoryController: CategoryDependencies["categoryController"];
  courseController: CourseDependencies["courseController"];
  lessonController: LessonDependencies["lessonController"];
}

export const initializeAppDependencies = (
  dbProvider: IDatabaseProvider
): AppDependencies => {
  const userDeps = initializeUserDependencies(dbProvider);
  const otpDeps = initializeOtpDependencies(dbProvider);
  const authDeps = initializeAuthDependencies(dbProvider, otpDeps.otpService , userDeps.userService);
  const instructorDeps = initializeInstructorDependencies(dbProvider, userDeps.userService );
  const categoryDeps = initializeCategoryDependencies(dbProvider);
  const courseDeps = initializeCourseDependencies(
    dbProvider,
    categoryDeps.categoryRepository
  );
  const lessonDeps = initializeLessonDependencies(
    dbProvider,
    courseDeps.courseRepository
  );

  return {
    authController: authDeps.authController,
    userController: userDeps.userController,
    instructorController: instructorDeps.instructorController,
    otpController: otpDeps.otpController,
    categoryController: categoryDeps.categoryController,
    courseController: courseDeps.courseController,
    lessonController: lessonDeps.lessonController,
  };
};
