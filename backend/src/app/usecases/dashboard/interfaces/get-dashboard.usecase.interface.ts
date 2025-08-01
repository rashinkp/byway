import { ICourseStats } from "../../course/interfaces/get-course-stats.usecase.interface";
import { ITopEnrolledCourse } from "../../course/interfaces/get-top-enrolled-courses.usecase.interface";
import { IUserStats } from "../../user/interfaces/get-user-stats.usecase.interface";
import { ITopInstructor } from "../../user/interfaces/get-top-instructors.usecase.interface";
import { IEnrollmentStats } from "../../enrollment/interfaces/get-enrollment-stats.usecase.interface";

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