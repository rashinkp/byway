import {
  ICourseResponseDTO,
  IGetAllCoursesInputDTO,
} from "../../../dtos/course/course.dto";

export interface IGetAllCoursesUseCase {
  execute(input: IGetAllCoursesInputDTO): Promise<ICourseResponseDTO>;
}
