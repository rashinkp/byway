import {
  IUpdateCourseInputDTO,
  ICourseWithDetailsDTO
} from "../../../../domain/dtos/course/course.dto";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IUpdateCourseUseCase } from "../interfaces/update-course.usecase.interface";
import { Price } from "../../../../domain/value-object/price";
import { Duration } from "../../../../domain/value-object/duration";
import { Offer } from "../../../../domain/value-object/offer";

export class UpdateCourseUseCase implements IUpdateCourseUseCase {
  constructor(
    private courseRepository: ICourseRepository,
  ) {}

  async execute(input: IUpdateCourseInputDTO): Promise<ICourseWithDetailsDTO> {
    try {
      const course = await this.courseRepository.findById(input.id);
      if (!course) {
        throw new HttpError("Course not found", 404);

        
      }


      console.log("Updating course with input:", input);


      // Update course with input data
      course.updateBasicInfo({
        title: input.title,
        description: input.description,
        categoryId: input.categoryId,
        price: input.price ? Price.create(input.price) : null,
        duration: input.duration ? Duration.create(input.duration) : null,
        level: input.level,
        thumbnail: input.thumbnail,
        offer: input.offer ? Offer.create(input.offer) : null,
        status: input.status,
        adminSharePercentage: input.adminSharePercentage
      });


      console.log("Course updated with basic info:", course.toJSON());


      // Update course details if provided
      if (input.longDescription || input.prerequisites || input.objectives || input.targetAudience) {
        course.updateDetails({
          longDescription: input.longDescription,
          prerequisites: input.prerequisites,
          objectives: input.objectives,
          targetAudience: input.targetAudience
        });
      }

      const updatedCourse = await this.courseRepository.update(course);
      return updatedCourse.toJSON();
    } catch (error) {
      console.error("Error updating course", { error, input });
      throw new HttpError("Failed to update course", 500);
    }
  }
}
