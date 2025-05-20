import { ICourseOutputDTO } from "../../../../domain/dtos/course/course.dto";


export interface IDeleteCourseUseCase {
  execute(
    courseId: string,
    userId: string,
    role: string
  ): Promise<ICourseOutputDTO>;
}
