import { CourseReview } from "../../domain/entities/course-review.entity";
import { User } from "../../domain/entities/user.entity";
import { Course } from "../../domain/entities/course.entity";
import {
  CreateCourseReviewRequestDto,
  UpdateCourseReviewRequestDto,
  GetCourseReviewsRequestDto,
  GetUserReviewsRequestDto,
  DeleteCourseReviewRequestDto,
  MarkReviewHelpfulRequestDto,
  CourseReviewResponseDto,
  CourseReviewsListResponseDto,
  CourseReviewStatsResponseDto,
  UserReviewResponseDto,
} from "../dtos/course-review.dto";

export class CourseReviewMapper {
  // Domain Entity to Response DTOs
  static toCourseReviewResponseDto(
    review: CourseReview,
    user?: User,
    additionalData?: {
      helpfulCount?: number;
      isHelpful?: boolean;
      canEdit?: boolean;
      canDelete?: boolean;
    }
  ): CourseReviewResponseDto {
    const response: CourseReviewResponseDto = {
      id: review.id,
      userId: review.userId,
      courseId: review.courseId,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      isActive: review.isActive(),
      hasTitle: review.hasTitle(),
      hasComment: review.hasComment(),
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      deletedAt: review.deletedAt,
    };

    if (user) {
      response.user = {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        isActive: !user.isDeleted(),
      };
    }

    if (additionalData) {
      Object.assign(response, additionalData);
    }

    return response;
  }

  static toCourseReviewsListResponseDto(
    reviews: CourseReviewResponseDto[],
    pagination: {
      total: number;
      totalPages: number;
    },
    filters?: {
      ratings?: number[];
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }
  ): CourseReviewsListResponseDto {
    return {
      reviews,
      total: pagination.total,
      totalPages: pagination.totalPages,
      filters,
    };
  }

  static toCourseReviewStatsResponseDto(
    course: Course,
    stats: {
      totalReviews: number;
      averageRating: number;
      ratingDistribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
      };
      recentReviews: CourseReviewResponseDto[];
      topReviews: CourseReviewResponseDto[];
    }
  ): CourseReviewStatsResponseDto {
    return {
      courseId: course.id,
      courseName: course.title,
      courseThumbnail: course.thumbnail,
      totalReviews: stats.totalReviews,
      averageRating: stats.averageRating,
      ratingDistribution: stats.ratingDistribution,
      recentReviews: stats.recentReviews,
      topReviews: stats.topReviews,
    };
  }

  static toUserReviewResponseDto(
    review: CourseReview,
    course?: Course,
    additionalData?: {
      helpfulCount?: number;
      isHelpful?: boolean;
      canEdit?: boolean;
      canDelete?: boolean;
    }
  ): UserReviewResponseDto {
    const response: UserReviewResponseDto = {
      id: review.id,
      userId: review.userId,
      courseId: review.courseId,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      isActive: review.isActive(),
      hasTitle: review.hasTitle(),
      hasComment: review.hasComment(),
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      deletedAt: review.deletedAt,
    };

    if (course) {
      response.course = {
        id: course.id,
        title: course.title,
        thumbnail: course.thumbnail,
        level: course.level,
        status: course.status,
        approvalStatus: course.approvalStatus,
      };
    }

    if (additionalData) {
      Object.assign(response, additionalData);
    }

    return response;
  }
}