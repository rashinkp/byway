
import { ICourseWithEnrollmentDTO } from "@/domain/dtos/course/course.dto";
import { JwtPayload } from "jsonwebtoken";

export interface IGetCourseWithDetailsUseCase {
  execute(
    courseId: string,
    user?: JwtPayload
  ): Promise<ICourseWithEnrollmentDTO | null>;
}
