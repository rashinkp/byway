import {
  ICourseResponseDTO,
  IGetAllCoursesInputDTO,
} from "../../../dtos/course.dto";

export interface IGetAllCoursesUseCase {
  execute(input: IGetAllCoursesInputDTO): Promise<ICourseResponseDTO>;
}
