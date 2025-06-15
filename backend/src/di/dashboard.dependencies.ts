import { SharedDependencies } from "./shared.dependencies";
import { GetCourseStatsUseCase } from "../app/usecases/course/implementations/get-course-stats.usecase";
import { GetTopEnrolledCoursesUseCase } from "../app/usecases/course/implementations/get-top-enrolled-courses.usecase";
import { GetUserStatsUseCase } from "../app/usecases/user/implementations/get-user-stats.usecase";
import { GetTopInstructorsUseCase } from "../app/usecases/user/implementations/get-top-instructors.usecase";
import { GetEnrollmentStatsUseCase } from "../app/usecases/enrollment/implementations/get-enrollment-stats.usecase";
import { GetDashboardUseCase } from "../app/usecases/dashboard/implementations/get-dashboard.usecase";
import { DashboardController } from "../presentation/http/controllers/dashboard.controller";
import { GetLatestRevenueUseCase } from "../app/usecases/revenue/implementations/get-latest-revenue.usecase";

export const createDashboardDependencies = (sharedDeps: SharedDependencies) => {
  const { 
    courseRepository, 
    userRepository, 
    enrollmentRepository, 
    instructorRepository,
    revenueRepository,
    httpErrors, 
    httpSuccess 
  } = sharedDeps;

  // Create use cases using shared repositories
  const getCourseStatsUseCase = new GetCourseStatsUseCase(courseRepository);
  const getTopEnrolledCoursesUseCase = new GetTopEnrolledCoursesUseCase(courseRepository);
  const getUserStatsUseCase = new GetUserStatsUseCase(userRepository);
  const getTopInstructorsUseCase = new GetTopInstructorsUseCase(instructorRepository);
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
