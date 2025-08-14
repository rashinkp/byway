import { IGetCourseStatsUseCase } from "../interfaces/get-course-stats.usecase.interface";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import {  CourseOverallStatsDTO, IGetCourseStatsInput } from "../../../dtos/course.dto";

export class GetCourseStatsUseCase implements IGetCourseStatsUseCase {
  constructor(private readonly courseRepository: ICourseRepository) {}

  async execute(input: IGetCourseStatsInput): Promise<CourseOverallStatsDTO> {
    return this.courseRepository.getCourseStats(input);
  }
} 