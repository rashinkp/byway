import { IGetCourseStatsUseCase, ICourseStats, IGetCourseStatsInput } from "../interfaces/get-course-stats.usecase.interface";
import { ICourseRepository } from "../../../repositories/course.repository.interface";

export class GetCourseStatsUseCase implements IGetCourseStatsUseCase {
  constructor(private readonly courseRepository: ICourseRepository) {}

  async execute(input: IGetCourseStatsInput): Promise<ICourseStats> {
    return this.courseRepository.getCourseStats(input);
  }
} 