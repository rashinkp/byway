import { ICourseOutputDTO, ICreateCourseInputDTO } from "../../../../domain/dtos/course/course.dto";


export interface ICreateCourseUseCase {
  execute(input: ICreateCourseInputDTO): Promise<ICourseOutputDTO>;
}
