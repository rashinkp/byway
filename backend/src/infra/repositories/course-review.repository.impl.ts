import { PrismaClient } from "@prisma/client";
import { CourseReview } from "../../domain/entities/review.entity";
import {
  QueryCourseReviewDto,
  CourseReviewResponseDto,
  CourseReviewSummaryDto,
} from "../../app/dtos/course-review";
import { ICourseReviewRepository } from "../../app/repositories/course-review.repository.interface";
import { Rating } from "../../domain/value-object/rating";

function toCourseReviewEntity(data: any): CourseReview {
  return new CourseReview({
    id: data.id,
    courseId: data.courseId,
    userId: data.userId,
    rating: new Rating(data.rating),
    title: data.title,
    comment: data.comment,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    deletedAt: data.deletedAt,
  });
}

function toCourseReviewResponseDto(data: any): CourseReviewResponseDto {
  return {
    id: data.id,
    courseId: data.courseId,
    userId: data.userId,
    rating: data.rating,
    title: data.title,
    comment: data.comment,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    deletedAt: data.deletedAt,
    user: data.user
      ? {
          id: data.user.id,
          name: data.user.name,
          avatar: data.user.avatar,
        }
      : undefined,
  };
}

export class CourseReviewRepository implements ICourseReviewRepository {
  constructor(private prisma: PrismaClient) {}

  async save(review: CourseReview): Promise<CourseReview> {
    const created = await this.prisma.courseReview.create({
      data: {
        courseId: review.courseId,
        userId: review.userId,
        rating: review.rating.value,
        title: review.title,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        deletedAt: review.deletedAt,
      },
    });
    return toCourseReviewEntity(created);
  }

  async findById(id: string): Promise<CourseReview | null> {
    const found = await this.prisma.courseReview.findUnique({ where: { id } });
    return found ? toCourseReviewEntity(found) : null;
  }

  async update(review: CourseReview): Promise<CourseReview> {
    const updated = await this.prisma.courseReview.update({
      where: { id: review.id },
      data: {
        rating: review.rating.value,
        title: review.title,
        comment: review.comment,
        updatedAt: new Date(),
      },
    });
    return toCourseReviewEntity(updated);
  }

  async softDelete(review: CourseReview): Promise<CourseReview> {
    const deleted = await this.prisma.courseReview.update({
      where: { id: review.id },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return toCourseReviewEntity(deleted);
  }

  async restore(review: CourseReview): Promise<CourseReview> {
    const restored = await this.prisma.courseReview.update({
      where: { id: review.id },
      data: {
        deletedAt: null,
        updatedAt: new Date(),
      },
    });
    return toCourseReviewEntity(restored);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.courseReview.delete({
      where: { id },
    });
  }

  async findByCourseId(
    courseId: string,
    query: QueryCourseReviewDto,
    userId?: string
  ): Promise<{
    reviews: CourseReviewResponseDto[];
    total: number;
    totalPages: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      courseId,
    };

    if (!query.includeDisabled) {
      where.deletedAt = null;
    }

    if (query.isMyReviews && userId) {
      where.userId = userId;
    }

    if (query.rating) {
      where.rating = query.rating;
    }

    const orderBy: any = {};
    if (query.sortBy === "rating") {
      orderBy.rating = query.sortOrder || "desc";
    } else {
      orderBy.createdAt = query.sortOrder || "desc";
    }

    const [total, reviews] = await this.prisma.$transaction([
      this.prisma.courseReview.count({ where }),
      this.prisma.courseReview.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { user: { select: { id: true, name: true, avatar: true } } },
      }),
    ]);

    return {
      reviews: reviews.map(toCourseReviewResponseDto),
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByUserId(
    userId: string,
    page = 1,
    limit = 10
  ): Promise<{
    reviews: CourseReviewResponseDto[];
    total: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const where = { userId, deletedAt: null };

    const [total, reviews] = await this.prisma.$transaction([
      this.prisma.courseReview.count({ where }),
      this.prisma.courseReview.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: { user: { select: { id: true, name: true, avatar: true } } },
      }),
    ]);

    return {
      reviews: reviews.map(toCourseReviewResponseDto),
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByUserAndCourse(
    userId: string,
    courseId: string
  ): Promise<CourseReview | null> {
    const found = await this.prisma.courseReview.findFirst({
      where: { userId, courseId, deletedAt: null },
    });
    return found ? toCourseReviewEntity(found) : null;
  }

  async getCourseReviewStats(
    courseId: string
  ): Promise<CourseReviewSummaryDto> {
    const [average, total, distribution, recentReviews] =
      await this.prisma.$transaction([
        this.prisma.courseReview.aggregate({
          where: { courseId, deletedAt: null },
          _avg: { rating: true },
        }),
        this.prisma.courseReview.count({
          where: { courseId, deletedAt: null },
        }),
        this.prisma.courseReview.groupBy({
          by: ["rating"],
          where: { courseId, deletedAt: null },
          orderBy: [],
          _count: { rating: true },
        }),
        this.prisma.courseReview.findMany({
          where: { courseId, deletedAt: null },
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { user: { select: { id: true, name: true, avatar: true } } },
        }),
      ]);

    const ratingDistribution: { [key: number]: number } = {};
    for (let i = 1; i <= 5; i++) ratingDistribution[i] = 0;
    for (const d of distribution) {
      if (
        d._count &&
        typeof d._count === "object" &&
        typeof d._count.rating === "number"
      ) {
        ratingDistribution[d.rating] = d._count.rating;
      }
    }

    return {
      averageRating: average._avg.rating || 0,
      totalReviews: total,
      ratingDistribution,
      recentReviews: recentReviews.map(toCourseReviewResponseDto),
    };
  }
}
