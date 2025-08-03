import {
  ICourseWithDetailsDTO,
  IUpdateCourseApprovalInputDTO,
} from "../../../dtos/course/course.dto";

export interface IApproveCourseUseCase {
  execute(input: IUpdateCourseApprovalInputDTO): Promise<ICourseWithDetailsDTO>;
}
