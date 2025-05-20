import { ICourseOutputDTO, IUpdateCourseApprovalInputDTO } from "../../../../domain/dtos/course/course.dto";

export interface IDeclineCourseUseCase {
  execute(input: IUpdateCourseApprovalInputDTO): Promise<ICourseOutputDTO>;
}
