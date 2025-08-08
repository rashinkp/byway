import { CourseStats } from "../../../dtos/stats.dto";


export interface IGetTopEnrolledCoursesInput {
  userId: string;
  limit?: number;
  role?: "ADMIN" | "INSTRUCTOR";
}

export interface IGetTopEnrolledCoursesUseCase {
  execute(input: IGetTopEnrolledCoursesInput): Promise<CourseStats[]>;
} 