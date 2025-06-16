import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IDeleteCourseUseCase } from "../interfaces/delete-course.usecase.interface";
import { ICourseWithDetailsDTO } from "../../../../domain/dtos/course/course.dto";

export class DeleteCourseUseCase implements IDeleteCourseUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(
    courseId: string,
    userId: string,
    role: string
  ): Promise<ICourseWithDetailsDTO> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new HttpError("Course not found", 404);
    }

    if (course.createdBy !== userId && role !== "ADMIN") {
      throw new HttpError(
        "Only the course creator or admins can delete or restore it",
        403
      );
    }

    course.softDelete();
    const updatedCourse = await this.courseRepository.softDelete(course);
    return updatedCourse.toJSON();
  }
}
