import { CourseOverallStats } from "../../domain/types/course-stats.interface";
import { IEnrollmentStats } from "../../domain/types/enrollment.interface";
import { IUserStats } from "../usecases/user/interfaces/get-user-stats.usecase.interface";
import { ITopEnrolledCourse, ITopInstructor } from "./admin.dto";

export interface IDashboardStatsDTO {
    courseStats: CourseOverallStats;
    userStats: IUserStats;
    enrollmentStats: IEnrollmentStats;
    totalRevenue: number;
  }
  
  export interface IDashboardResponseDTO {
    stats: IDashboardStatsDTO;
    topEnrolledCourses: ITopEnrolledCourse[];
    topInstructors: ITopInstructor[];
  }
  
  export interface IGetDashboardInputDTO {
    userId: string;
    limit?: number;
  }
  

