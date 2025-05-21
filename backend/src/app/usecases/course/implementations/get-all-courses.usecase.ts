import {
  ICourseResponseDTO,
  IGetAllCoursesInputDTO,
} from "../../../../domain/dtos/course/course.dto";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IGetAllCoursesUseCase } from "../interfaces/get-all-courses.usecase.interface";

export class GetAllCoursesUseCase implements IGetAllCoursesUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(input: IGetAllCoursesInputDTO): Promise<ICourseResponseDTO> {
    try {
      const result = await this.courseRepository.findAll(input);
      return result;
    } catch (error) {
      throw new HttpError("Failed to retrieve courses", 500);
    }
  }
}
