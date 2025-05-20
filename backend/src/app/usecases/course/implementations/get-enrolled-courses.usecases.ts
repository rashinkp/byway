import {
  ICourseResponseDTO,
  IGetEnrolledCoursesInputDTO,
} from "../../../../domain/dtos/course/course.dto";
import { HttpError } from "../../../../presentation/http/utils/HttpErrors";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IUserRepository } from "../../../repositories/user.repository";
import { IGetEnrolledCoursesUseCase } from "../interfaces/get-enrolled-courses.usecase.interface";

export class GetEnrolledCoursesUseCase implements IGetEnrolledCoursesUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(
    input: IGetEnrolledCoursesInputDTO
  ): Promise<ICourseResponseDTO> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    try {
      const result = await this.courseRepository.findEnrolledCourses(input);
      return result;
    } catch (error) {
      throw new HttpError("Failed to retrieve enrolled courses", 500);
    }
  }
}
