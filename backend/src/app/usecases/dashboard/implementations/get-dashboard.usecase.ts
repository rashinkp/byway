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
    private readonly _getCourseStatsUseCase: IGetCourseStatsUseCase,
    private readonly _getTopEnrolledCoursesUseCase: IGetTopEnrolledCoursesUseCase,
    private readonly _getUserStatsUseCase: IGetUserStatsUseCase,
    private readonly _getTopInstructorsUseCase: IGetTopInstructorsUseCase,
    private readonly _getEnrollmentStatsUseCase: IGetEnrollmentStatsUseCase,
    private readonly _revenueRepository: IRevenueRepository
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
      this._getCourseStatsUseCase.execute({}),
      this._getTopEnrolledCoursesUseCase.execute({
        userId: input.userId,
        limit: 5,
        role: "ADMIN",
      }),
      this._getUserStatsUseCase.execute({}),
      this._getTopInstructorsUseCase.execute({ limit: 5 }),
      this._getEnrollmentStatsUseCase.execute({}),
      this._revenueRepository.getTotalRevenue(input.userId),
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
