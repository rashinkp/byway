import { ICourseWithDetailsDTO, IUpdateCourseApprovalInputDTO } from "../../../../domain/dtos/course/course.dto";

export interface IApproveCourseUseCase {
  execute(input: IUpdateCourseApprovalInputDTO): Promise<ICourseWithDetailsDTO>;
}
