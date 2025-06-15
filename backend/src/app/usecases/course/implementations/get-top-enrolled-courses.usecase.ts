import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IGetTopEnrolledCoursesUseCase, ITopEnrolledCourse, IGetTopEnrolledCoursesInput } from "../interfaces/get-top-enrolled-courses.usecase.interface";

export class GetTopEnrolledCoursesUseCase implements IGetTopEnrolledCoursesUseCase {
  constructor(private readonly courseRepository: ICourseRepository) {}

  async execute(input: IGetTopEnrolledCoursesInput): Promise<ITopEnrolledCourse[]> {
    return this.courseRepository.getTopEnrolledCourses(input);
  }
} 