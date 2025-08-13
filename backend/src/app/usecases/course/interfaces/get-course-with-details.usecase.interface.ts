import { ICourseWithEnrollmentDTO } from "../../../dtos/course.dto";
import { UserDTO } from "../../../dtos/general.dto";

export interface IGetCourseWithDetailsUseCase {
  execute(
    courseId: string,
    user?: UserDTO
  ): Promise<ICourseWithEnrollmentDTO | null>;
}
