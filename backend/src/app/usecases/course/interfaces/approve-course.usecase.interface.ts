import { ICourseOutputDTO, IUpdateCourseApprovalInputDTO } from "../../../../domain/dtos/course/course.dto";


export interface IApproveCourseUseCase {
  execute(input: IUpdateCourseApprovalInputDTO): Promise<ICourseOutputDTO>;
}
