import { ICourseWithDetailsDTO, IUpdateCourseInputDTO } from "../../../../domain/dtos/course/course.dto";


export interface IUpdateCourseUseCase {
  execute(input: IUpdateCourseInputDTO): Promise<ICourseWithDetailsDTO>;
}
