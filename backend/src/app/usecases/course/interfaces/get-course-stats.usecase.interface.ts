import {  CourseOverallStatsDTO, IGetCourseStatsInput } from "../../../dtos/course.dto";

export interface IGetCourseStatsUseCase {
  execute(input: IGetCourseStatsInput): Promise<CourseOverallStatsDTO>;
} 