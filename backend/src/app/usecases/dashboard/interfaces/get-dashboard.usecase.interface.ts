import { ICourseStats } from "../../course/interfaces/get-course-stats.usecase.interface";
import { IUserStats } from "../../user/interfaces/get-user-stats.usecase.interface";
import { IEnrollmentStats } from "../../enrollment/interfaces/get-enrollment-stats.usecase.interface";
import { ITopEnrolledCourse, ITopInstructor } from "../../../dtos/admin.dto";

export interface IDashboardStats {
  courseStats: ICourseStats;
  userStats: IUserStats;
  enrollmentStats: IEnrollmentStats;
  totalRevenue: number;
}

export interface IDashboardResponse {
  stats: IDashboardStats;
  topEnrolledCourses: ITopEnrolledCourse[];
  topInstructors: ITopInstructor[];
}

export interface IGetDashboardInput {
  userId: string;
  limit?: number;
}

export interface IGetDashboardUseCase {
  execute(input: IGetDashboardInput): Promise<IDashboardResponse>;
}
