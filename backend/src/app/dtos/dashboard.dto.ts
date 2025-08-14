import { CourseOverallStats } from "../../domain/types/course-stats.interface";
import { IEnrollmentStats } from "../../domain/types/enrollment.interface";

import { ITopEnrolledCourse, ITopInstructor } from "./admin.dto";
import { IUserStatsDTO } from "./user.dto";

export interface IDashboardStatsDTO {
    courseStats: CourseOverallStats;
    userStats: IUserStatsDTO;
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
  

