import { ICourseOutputDTO } from "../../../../domain/dtos/course/course.dto";
import { HttpError } from "../../../../presentation/http/utils/HttpErrors";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IDeleteCourseUseCase } from "../interfaces/delete-course.usecase.interface";

export class DeleteCourseUseCase implements IDeleteCourseUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(
    courseId: string,
    userId: string,
    role: string
  ): Promise<ICourseOutputDTO> {
    const course = await this.courseRepository.findById(courseId);
    if (!course || course.deletedAt) {
      throw new HttpError("Course not found or already deleted", 404);
    }

    if (course.createdBy !== userId && role !== "ADMIN") {
      throw new HttpError(
        "Only the course creator or admins can delete it",
        403
      );
    }

    course.softDelete();
    const deletedCourse = await this.courseRepository.softDelete(course);

    return deletedCourse.toJSON();
  }
}
