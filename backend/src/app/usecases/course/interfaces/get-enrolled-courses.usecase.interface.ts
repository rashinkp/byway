import {
  ICourseResponseDTO,
  IGetEnrolledCoursesInputDTO,
} from "../../../dtos/course.dto";

export interface IGetEnrolledCoursesUseCase {
  execute(input: IGetEnrolledCoursesInputDTO): Promise<ICourseResponseDTO>;
}
