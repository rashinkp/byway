import { ICreateCourseInputDTO } from "../../../../domain/dtos/course/course.dto";
import { CreateCourseResultDTO } from "../implementations/create-course.usecase";

export interface ICreateCourseUseCase {
  execute(input: ICreateCourseInputDTO): Promise<CreateCourseResultDTO>;
}
