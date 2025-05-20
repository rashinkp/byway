import { ICourseWithEnrollmentStatus } from "../../../../domain/dtos/course/course.dto";


export interface IGetCourseByIdUseCase {
  execute(
    courseId: string,
    userId?: string
  ): Promise<ICourseWithEnrollmentStatus | null>;
}
