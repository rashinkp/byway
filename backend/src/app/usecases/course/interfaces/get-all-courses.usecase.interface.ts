import { ICourseResponseDTO, IGetAllCoursesInputDTO } from "../../../../domain/dtos/course/course.dto";


export interface IGetAllCoursesUseCase {
  execute(input: IGetAllCoursesInputDTO): Promise<ICourseResponseDTO>;
}
