import { CourseStatsDTO } from "../../../dtos/course.dto";

export interface IGetTopEnrolledCoursesInput {
  userId: string;
  limit?: number;
  role?: "ADMIN" | "INSTRUCTOR";
}

export interface IGetTopEnrolledCoursesUseCase {
  execute(input: IGetTopEnrolledCoursesInput): Promise<CourseStatsDTO[]>;
} 