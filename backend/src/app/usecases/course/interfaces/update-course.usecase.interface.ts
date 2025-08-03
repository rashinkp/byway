import {
  ICourseWithDetailsDTO,
  IUpdateCourseInputDTO,
} from "../../../dtos/course/course.dto";

export interface IUpdateCourseUseCase {
  execute(input: IUpdateCourseInputDTO): Promise<ICourseWithDetailsDTO>;
}
