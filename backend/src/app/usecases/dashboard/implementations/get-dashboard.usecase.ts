import {
  IGetDashboardUseCase,
} from "../interfaces/get-dashboard.usecase.interface";
import { IGetCourseStatsUseCase } from "../../course/interfaces/get-course-stats.usecase.interface";
import { IGetTopEnrolledCoursesUseCase } from "../../course/interfaces/top-enrolled-courses.usecase.interface";
import { IGetUserStatsUseCase } from "../../user/interfaces/get-user-stats.usecase.interface";
import { IGetTopInstructorsUseCase } from "../../user/interfaces/get-top-instructors.usecase.interface";
import { IGetEnrollmentStatsUseCase } from "../../enrollment/interfaces/get-enrollment-stats.usecase.interface";
import { IRevenueRepository } from "../../../repositories/revenue.repository";
import { IDashboardResponseDTO, IGetDashboardInputDTO } from "../../../dtos/dashboard.dto";

export class GetDashboardUseCase implements IGetDashboardUseCase {
  constructor(
    private readonly getCourseStatsUseCase: IGetCourseStatsUseCase,
    private readonly getTopEnrolledCoursesUseCase: IGetTopEnrolledCoursesUseCase,
    private readonly getUserStatsUseCase: IGetUserStatsUseCase,
    private readonly getTopInstructorsUseCase: IGetTopInstructorsUseCase,
    private readonly getEnrollmentStatsUseCase: IGetEnrollmentStatsUseCase,
    private readonly revenueRepository: IRevenueRepository
  ) {}

  async execute(input: IGetDashboardInputDTO): Promise<IDashboardResponseDTO> {
    const [
      courseStats,
      topEnrolledCourses,
      userStats,
      topInstructors,
      enrollmentStats,
      totalRevenue,
    ] = await Promise.all([
      this.getCourseStatsUseCase.execute({}),
      this.getTopEnrolledCoursesUseCase.execute({
        userId: input.userId,
        limit: 5,
        role: "ADMIN",
      }),
      this.getUserStatsUseCase.execute({}),
      this.getTopInstructorsUseCase.execute({ limit: 5 }),
      this.getEnrollmentStatsUseCase.execute({}),
      this.revenueRepository.getTotalRevenue(input.userId),
    ]);

    return {
      stats: {
        courseStats,
        userStats,
        enrollmentStats,
        totalRevenue,
      },
      topEnrolledCourses,
      topInstructors,
    };
  }
}
