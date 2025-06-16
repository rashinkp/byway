import {
  IUpdateCourseApprovalInputDTO,
  ICourseWithDetailsDTO
} from "../../../../domain/dtos/course/course.dto";
import { APPROVALSTATUS } from "../../../../domain/enum/approval-status.enum";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { IApproveCourseUseCase } from "../interfaces/approve-course.usecase.interface";

export class ApproveCourseUseCase implements IApproveCourseUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(
    input: IUpdateCourseApprovalInputDTO
  ): Promise<ICourseWithDetailsDTO> {
    const course = await this.courseRepository.findById(input.courseId);
    if (!course) {
      throw new HttpError("Course not found", 404);
    }

    course.setApprovalStatus(APPROVALSTATUS.APPROVED);
    const updatedCourse = await this.courseRepository.updateApprovalStatus(
      course
    );

    return updatedCourse.toJSON();
  }
}
