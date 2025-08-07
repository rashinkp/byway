import {
  ICourseWithDetailsDTO,
  IUpdateCourseApprovalInputDTO,
} from "../../../dtos/course.dto";

export interface IDeclineCourseUseCase {
  execute(input: IUpdateCourseApprovalInputDTO): Promise<ICourseWithDetailsDTO>;
}
