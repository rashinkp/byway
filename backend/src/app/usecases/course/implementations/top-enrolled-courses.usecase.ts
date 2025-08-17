
import { CourseStatsDTO } from "../../../dtos/course.dto";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import {
  IGetTopEnrolledCoursesUseCase,
  IGetTopEnrolledCoursesInput,
} from "../interfaces/top-enrolled-courses.usecase.interface";

export class GetTopEnrolledCoursesUseCase
  implements IGetTopEnrolledCoursesUseCase
{
  constructor(private readonly _courseRepository: ICourseRepository) {}

  async execute(input: IGetTopEnrolledCoursesInput): Promise<CourseStatsDTO[]> {
    return this._courseRepository.getTopEnrolledCourses(input);
  }
}
