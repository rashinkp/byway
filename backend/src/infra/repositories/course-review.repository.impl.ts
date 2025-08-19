import { PrismaClient } from "@prisma/client";
import { CourseReview } from "../../domain/entities/review.entity";
import { ICourseReviewRepository } from "../../app/repositories/course-review.repository.interface";
import { ICourseReviewWithUser, ICourseReviewSummary, ICourseReviewQuery, ICourseReviewPaginatedResult } from "../../domain/types/review.interface";
import { GenericRepository } from "./base/generic.repository";


function toCourseReviewWithUser(data: {
  id: string;
  courseId: string;
  userId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  user?: {
    id: string;
    name: string;
    avatar: string | null;
  } | null;
}): ICourseReviewWithUser {
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

export class CourseReviewRepository extends GenericRepository<CourseReview> implements ICourseReviewRepository {
  constructor(private _prisma: PrismaClient) {
    super(_prisma, 'courseReview');
  }

  protected getPrismaModel() {
    return this._prisma.courseReview;
  }

  protected mapToEntity(review: any): CourseReview {
    return CourseReview.fromPersistence(review);
  }

  protected mapToPrismaData(entity: any): any {
    if (entity instanceof CourseReview) {
      return {
        courseId: entity.courseId,
        userId: entity.userId,
        rating: entity.rating.value,
        title: entity.title,
        comment: entity.comment,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        deletedAt: entity.deletedAt,
      };
    }
    return entity;
  }

  async save(review: CourseReview): Promise<CourseReview> {
    const created = await this._prisma.courseReview.create({
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
    return CourseReview.fromPersistence(created);
  }

  async findById(id: string): Promise<CourseReview | null> {
    return this.findByIdGeneric(id);
  }

  async update(review: CourseReview): Promise<CourseReview> {
    const updated = await this._prisma.courseReview.update({
      where: { id: review.id },
      data: {
        rating: review.rating.value,
        title: review.title,
        comment: review.comment,
        updatedAt: new Date(),
      },
    });
    return CourseReview.fromPersistence(updated);
  }

  async softDelete(review: CourseReview): Promise<CourseReview> {
    const deleted = await this._prisma.courseReview.update({
      where: { id: review.id },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return CourseReview.fromPersistence(deleted);
  }

  async restore(review: CourseReview): Promise<CourseReview> {
    const restored = await this._prisma.courseReview.update({
      where: { id: review.id },
      data: {
        deletedAt: null,
        updatedAt: new Date(),
      },
    });
    return CourseReview.fromPersistence(restored);
  }

  async delete(id: string): Promise<void> {
    await this._prisma.courseReview.delete({
      where: { id },
    });
  }

  async findByCourseId(
    courseId: string,
    query: ICourseReviewQuery,
    userId?: string
  ): Promise<ICourseReviewPaginatedResult> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
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

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    if (query.sortBy === "rating") {
      orderBy.rating = query.sortOrder || "desc";
    } else {
      orderBy.createdAt = query.sortOrder || "desc";
    }

    const [total, reviews] = await this._prisma.$transaction([
      this._prisma.courseReview.count({ where }),
      this._prisma.courseReview.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { user: { select: { id: true, name: true, avatar: true } } },
      }),
    ]);

    return {
      reviews: reviews.map(toCourseReviewWithUser),
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByUserId(
    userId: string,
    page = 1,
    limit = 10
  ): Promise<ICourseReviewPaginatedResult> {
    const skip = (page - 1) * limit;
    const where = { userId, deletedAt: null };

    const [total, reviews] = await this._prisma.$transaction([
      this._prisma.courseReview.count({ where }),
      this._prisma.courseReview.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: { user: { select: { id: true, name: true, avatar: true } } },
      }),
    ]);

    return {
      reviews: reviews.map(toCourseReviewWithUser),
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByUserAndCourse(
    userId: string,
    courseId: string
  ): Promise<CourseReview | null> {
    const found = await this._prisma.courseReview.findFirst({
      where: { userId, courseId, deletedAt: null },
    });
    return found ? CourseReview.fromPersistence(found) : null;
  }

  async getCourseReviewStats(
    courseId: string
  ): Promise<ICourseReviewSummary> {
    const [average, total, distribution, recentReviews] =
      await this._prisma.$transaction([
        this._prisma.courseReview.aggregate({
          where: { courseId, deletedAt: null },
          _avg: { rating: true },
        }),
        this._prisma.courseReview.count({
          where: { courseId, deletedAt: null },
        }),
        this._prisma.courseReview.groupBy({
          by: ["rating"],
          where: { courseId, deletedAt: null },
          orderBy: [],
          _count: { rating: true },
        }),
        this._prisma.courseReview.findMany({
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
      recentReviews: recentReviews.map(toCourseReviewWithUser),
    };
  }
}
