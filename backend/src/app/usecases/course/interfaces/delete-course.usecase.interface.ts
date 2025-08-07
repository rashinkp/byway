import { ICourseWithDetailsDTO } from "../../../dtos/course.dto";

export interface IDeleteCourseUseCase {
  execute(
    courseId: string,
    userId: string,
    role: string
  ): Promise<ICourseWithDetailsDTO>;
}
