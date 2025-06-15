import { SharedDependencies } from "./shared.dependencies";
import { CourseRepository } from "../infra/repositories/course.repository.impl";
import { UserRepository } from "../infra/repositories/user.repository.impl";
import { EnrollmentRepository } from "../infra/repositories/enrollment.repository.impl";
import { GetCourseStatsUseCase } from "../app/usecases/course/implementations/get-course-stats.usecase";
import { GetTopEnrolledCoursesUseCase } from "../app/usecases/course/implementations/get-top-enrolled-courses.usecase";
import { GetUserStatsUseCase } from "../app/usecases/user/implementations/get-user-stats.usecase";
import { GetTopInstructorsUseCase } from "../app/usecases/user/implementations/get-top-instructors.usecase";
import { GetEnrollmentStatsUseCase } from "../app/usecases/enrollment/implementations/get-enrollment-stats.usecase";
import { GetDashboardUseCase } from "../app/usecases/dashboard/implementations/get-dashboard.usecase";
import { DashboardController } from "../presentation/http/controllers/dashboard.controller";
import { GetLatestRevenueUseCase } from "../app/usecases/revenue/implementations/get-latest-revenue.usecase";
import { PrismaRevenueRepository } from "../infra/repositories/revenue.repository";

export const createDashboardDependencies = (sharedDeps: SharedDependencies) => {
  const { prisma, httpErrors, httpSuccess } = sharedDeps;

  // Create repositories
  const courseRepository = new CourseRepository(prisma);
  const userRepository = new UserRepository(prisma);
  const enrollmentRepository = new EnrollmentRepository(prisma);
  const revenueRepository = new PrismaRevenueRepository(prisma);

  // Create use cases
  const getCourseStatsUseCase = new GetCourseStatsUseCase(courseRepository);
  const getTopEnrolledCoursesUseCase = new GetTopEnrolledCoursesUseCase(courseRepository);
  const getUserStatsUseCase = new GetUserStatsUseCase(userRepository);
  const getTopInstructorsUseCase = new GetTopInstructorsUseCase(userRepository);
  const getEnrollmentStatsUseCase = new GetEnrollmentStatsUseCase(enrollmentRepository);
  const getLatestRevenueUseCase = new GetLatestRevenueUseCase(revenueRepository);

  // Create main dashboard use case
  const getDashboardUseCase = new GetDashboardUseCase(
    getCourseStatsUseCase,
    getTopEnrolledCoursesUseCase,
    getUserStatsUseCase,
    getTopInstructorsUseCase,
    getEnrollmentStatsUseCase,
    revenueRepository
  );

  // Create controller
  const dashboardController = new DashboardController(
    getDashboardUseCase,
    httpErrors,
    httpSuccess
  );

  return {
    dashboardController,
    getDashboardUseCase,
    // Individual use cases for reuse
    getCourseStatsUseCase,
    getTopEnrolledCoursesUseCase,
    getUserStatsUseCase,
    getTopInstructorsUseCase,
    getEnrollmentStatsUseCase,
  };
};
