import { ICourseWithEnrollmentStatus } from "../../../../domain/dtos/course/course.dto";
import { JwtPayload } from "jsonwebtoken";

export interface IGetCourseByIdUseCase {
  execute(
    courseId: string,
    user?: JwtPayload
  ): Promise<ICourseWithEnrollmentStatus | null>;
}
