import {
  IUpdateCourseInputDTO,
  ICourseWithDetailsDTO,
} from "../../../dtos/course.dto";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IUpdateCourseUseCase } from "../interfaces/update-course.usecase.interface";
import { Price } from "../../../../domain/value-object/price";
import { Duration } from "../../../../domain/value-object/duration";
import { Offer } from "../../../../domain/value-object/offer";
import { CourseNotFoundError, ValidationError } from "../../../../domain/errors/domain-errors";

export class UpdateCourseUseCase implements IUpdateCourseUseCase {
  constructor(private _courseRepository: ICourseRepository) {}

  async execute(input: IUpdateCourseInputDTO): Promise<ICourseWithDetailsDTO> {
    try {
      const course = await this._courseRepository.findById(input.id);
      if (!course) {
        throw new CourseNotFoundError(input.id);
      }
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
        adminSharePercentage: input.adminSharePercentage,
      });

      // Update course details if provided
      if (
        input.longDescription ||
        input.prerequisites ||
        input.objectives ||
        input.targetAudience
      ) {
        course.updateDetails({
          longDescription: input.longDescription,
          prerequisites: input.prerequisites,
          objectives: input.objectives,
          targetAudience: input.targetAudience,
        });
      }

      const updatedCourse = await this._courseRepository.update(course);
      
      // Map domain entity to DTO
      return {
        id: updatedCourse.id,
        title: updatedCourse.title,
        description: updatedCourse.description,
        level: updatedCourse.level,
        price: updatedCourse.price?.getValue() ?? null,
        thumbnail: updatedCourse.thumbnail,
        duration: updatedCourse.duration?.getValue() ?? null,
        offer: updatedCourse.offer?.getValue() ?? null,
        status: updatedCourse.status,
        categoryId: updatedCourse.categoryId,
        createdBy: updatedCourse.createdBy,
        createdAt: updatedCourse.createdAt.toISOString(),
        updatedAt: updatedCourse.updatedAt.toISOString(),
        deletedAt: updatedCourse.deletedAt?.toISOString() ?? null,
        approvalStatus: updatedCourse.approvalStatus,
        adminSharePercentage: updatedCourse.adminSharePercentage,
        instructorSharePercentage: 100 - updatedCourse.adminSharePercentage,
        details: updatedCourse.details?.toJSON() ?? null,
        rating: updatedCourse.rating,
        reviewCount: updatedCourse.reviewCount,
                lessons: updatedCourse.lessons,
        bestSeller: updatedCourse.bestSeller,
        reviewStats: {
          averageRating: updatedCourse.rating || 0,
          totalReviews: updatedCourse.reviewCount || 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          ratingPercentages: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        },
      };
    } catch (error) {
      if (error instanceof CourseNotFoundError) {
        throw error;
      }
      throw new ValidationError("Failed to update course");
    }
  }
}
