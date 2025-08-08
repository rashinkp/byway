import { CourseStats } from "../../../dtos/stats.dto";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import {
  IGetTopEnrolledCoursesUseCase,
  IGetTopEnrolledCoursesInput,
} from "../interfaces/top-enrolled-courses.usecase.interface";

export class GetTopEnrolledCoursesUseCase
  implements IGetTopEnrolledCoursesUseCase
{
  constructor(private readonly courseRepository: ICourseRepository) {}

  async execute(input: IGetTopEnrolledCoursesInput): Promise<CourseStats[]> {
    return this.courseRepository.getTopEnrolledCourses(input);
  }
}
