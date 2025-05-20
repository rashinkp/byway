import { ICourseResponseDTO, IGetEnrolledCoursesInputDTO } from "../../../../domain/dtos/course/course.dto";


export interface IGetEnrolledCoursesUseCase {
  execute(input: IGetEnrolledCoursesInputDTO): Promise<ICourseResponseDTO>;
}
