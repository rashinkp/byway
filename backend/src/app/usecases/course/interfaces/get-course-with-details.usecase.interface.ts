import { ICourseWithEnrollmentDTO } from "../../..//dtos/course/course.dto";
import { JwtPayload } from "jsonwebtoken";

export interface IGetCourseWithDetailsUseCase {
  execute(
    courseId: string,
    user?: JwtPayload
  ): Promise<ICourseWithEnrollmentDTO | null>;
}
