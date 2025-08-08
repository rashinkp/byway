import {
  ICourseWithDetailsDTO,
  IUpdateCourseApprovalInputDTO,
} from "../../../dtos/course.dto";

export interface IApproveCourseUseCase {
  execute(input: IUpdateCourseApprovalInputDTO): Promise<ICourseWithDetailsDTO>;
}
