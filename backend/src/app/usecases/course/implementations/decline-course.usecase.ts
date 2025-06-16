import {
  ICourseWithDetailsDTO,
  IUpdateCourseApprovalInputDTO,
} from "../../../../domain/dtos/course/course.dto";
import { APPROVALSTATUS } from "../../../../domain/enum/approval-status.enum";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IDeclineCourseUseCase } from "../interfaces/decline-course.usecase.interface";

export class DeclineCourseUseCase implements IDeclineCourseUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(
    input: IUpdateCourseApprovalInputDTO
  ): Promise<ICourseWithDetailsDTO> {
    const course = await this.courseRepository.findById(input.courseId);
    if (!course) {
      throw new HttpError("Course not found", 404);
    }

    course.setApprovalStatus(APPROVALSTATUS.DECLINED);
    const updatedCourse = await this.courseRepository.updateApprovalStatus(
      course
    );

    return updatedCourse.toJSON();
  }
}
