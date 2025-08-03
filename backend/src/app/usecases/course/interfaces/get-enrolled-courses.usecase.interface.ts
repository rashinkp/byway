import {
  ICourseResponseDTO,
  IGetEnrolledCoursesInputDTO,
} from "../../../dtos/course/course.dto";

export interface IGetEnrolledCoursesUseCase {
  execute(input: IGetEnrolledCoursesInputDTO): Promise<ICourseResponseDTO>;
}
