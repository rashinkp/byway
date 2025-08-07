import {
  ICourseWithDetailsDTO,
  IUpdateCourseInputDTO,
} from "../../../dtos/course.dto";

export interface IUpdateCourseUseCase {
  execute(input: IUpdateCourseInputDTO): Promise<ICourseWithDetailsDTO>;
}
