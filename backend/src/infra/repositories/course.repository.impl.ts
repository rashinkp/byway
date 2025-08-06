import { PrismaClient, Prisma } from "@prisma/client";
import { CourseRecord } from "../../app/records/course.record";
import { CourseDetailsRecord } from "../../app/records/course-details.record";
import { ICourseRepository } from "../../app/repositories/course.repository.interface";

export class CourseRepository implements ICourseRepository {
  constructor(private prisma: PrismaClient) {}

  async save(course: CourseRecord): Promise<CourseRecord> {
    try {
      const saved = await this.prisma.course.create({
        data: {
          id: course.id,
          title: course.title,
          description: course.description,
          level: course.level as any,
          price: course.price ? new Prisma.Decimal(course.price) : null,
          thumbnail: course.thumbnail,
          duration: course.duration,
          offer: course.offer ? new Prisma.Decimal(course.offer) : null,
          status: course.status as any,
          categoryId: course.categoryId,
          createdBy: course.createdBy,
          createdAt: course.createdAt,
          updatedAt: course.updatedAt,
          deletedAt: course.deletedAt,
          approvalStatus: course.approvalStatus as any,
          adminSharePercentage: new Prisma.Decimal(course.adminSharePercentage),
        },
        include: { details: true },
      });

      return this.mapToCourseRecord(saved);
    } catch (error) {
      throw new Error(`Failed to save course: ${error}`);
    }
  }

  async findById(id: string): Promise<CourseRecord | null> {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id },
        include: { details: true },
      });

      return course ? this.mapToCourseRecord(course) : null;
    } catch (error) {
      throw new Error(`Failed to find course by id: ${error}`);
    }
  }

  async findByName(title: string): Promise<CourseRecord | null> {
    try {
      const course = await this.prisma.course.findFirst({
        where: { title },
        include: { details: true },
      });

      return course ? this.mapToCourseRecord(course) : null;
    } catch (error) {
      throw new Error(`Failed to find course by name: ${error}`);
    }
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    includeDeleted?: boolean;
    search?: string;
    filterBy?: string;
    userId?: string;
    myCourses?: boolean;
    role?: string;
    level?: string;
    duration?: string;
    price?: string;
    categoryId?: string;
  }): Promise<{ items: CourseRecord[]; total: number; totalPages: number }> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy,
        sortOrder = "desc",
        includeDeleted = false,
        search,
        filterBy,
        userId,
        myCourses = false,
        role,
        level,
        duration,
        price,
        categoryId,
      } = options;

      const skip = (page - 1) * limit;

      const where: Prisma.CourseWhereInput = {};

      if (!includeDeleted) {
        where.deletedAt = null;
      }

      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      if (filterBy) {
        switch (filterBy) {
          case "Active":
            where.deletedAt = null;
            break;
          case "Inactive":
            where.deletedAt = { not: null };
            break;
          case "Approved":
            where.approvalStatus = "APPROVED";
            break;
          case "Declined":
            where.approvalStatus = "DECLINED";
            break;
          case "Pending":
            where.approvalStatus = "PENDING";
            break;
          case "Published":
            where.status = "PUBLISHED";
            break;
          case "Draft":
            where.status = "DRAFT";
            break;
          case "Archived":
            where.status = "ARCHIVED";
            break;
        }
      }

      if (myCourses && userId) {
        where.createdBy = userId;
      }

      if (role === "INSTRUCTOR" && userId) {
        where.createdBy = userId;
      }

      if (level && level !== "All") {
        where.level = level as any;
      }

      if (duration && duration !== "All") {
        switch (duration) {
          case "Under5":
            where.duration = { lt: 5 };
            break;
          case "5to10":
            where.duration = { gte: 5, lte: 10 };
            break;
          case "Over10":
            where.duration = { gt: 10 };
            break;
        }
      }

      if (price && price !== "All") {
        switch (price) {
          case "Free":
            where.price = 0;
            break;
          case "Paid":
            where.price = { gt: 0 };
            break;
        }
      }

      if (categoryId) {
        where.categoryId = categoryId;
      }

      const orderBy: Prisma.CourseOrderByWithRelationInput = {};
      if (sortBy) {
        orderBy[sortBy as keyof Prisma.CourseOrderByWithRelationInput] = sortOrder;
      } else {
        orderBy.createdAt = sortOrder;
      }

      const [courses, total] = await Promise.all([
        this.prisma.course.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          include: { details: true },
        }),
        this.prisma.course.count({ where }),
      ]);

      return {
        items: courses.map(course => this.mapToCourseRecord(course)),
        total,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Failed to find all courses: ${error}`);
    }
  }

  async update(course: CourseRecord): Promise<CourseRecord> {
    try {
      const updated = await this.prisma.course.update({
        where: { id: course.id },
        data: {
          title: course.title,
          description: course.description,
          level: course.level as any,
          price: course.price ? new Prisma.Decimal(course.price) : null,
          thumbnail: course.thumbnail,
          duration: course.duration,
          offer: course.offer ? new Prisma.Decimal(course.offer) : null,
          status: course.status as any,
          categoryId: course.categoryId,
          adminSharePercentage: new Prisma.Decimal(course.adminSharePercentage),
          updatedAt: course.updatedAt,
          deletedAt: course.deletedAt,
          approvalStatus: course.approvalStatus as any,
        },
        include: { details: true },
      });

      return this.mapToCourseRecord(updated);
    } catch (error) {
      throw new Error(`Failed to update course: ${error}`);
    }
  }

  async softDelete(course: CourseRecord): Promise<CourseRecord> {
    try {
      const updated = await this.prisma.course.update({
        where: { id: course.id },
        data: {
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
        include: { details: true },
      });

      return this.mapToCourseRecord(updated);
    } catch (error) {
      throw new Error(`Failed to soft delete course: ${error}`);
    }
  }

  async findEnrolledCourses(options: {
    userId: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    search?: string;
    level?: string;
  }): Promise<{ items: CourseRecord[]; total: number; totalPages: number }> {
    try {
      const {
        userId,
        page = 1,
        limit = 10,
        sortBy = "enrolledAt",
        sortOrder = "desc",
        search,
        level,
      } = options;

      const skip = (page - 1) * limit;

      const where: Prisma.CourseWhereInput = {
        enrollments: {
          some: {
            userId: userId,
            accessStatus: "ACTIVE",
          },
        },
        deletedAt: null,
      };

      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      if (level && level !== "All") {
        where.level = level as any;
      }

      const orderBy: Prisma.CourseOrderByWithRelationInput = {};
      if (sortBy === "enrolledAt") {
        orderBy.enrollments = {
          _count: sortOrder,
        };
      } else {
        orderBy[sortBy as keyof Prisma.CourseOrderByWithRelationInput] = sortOrder;
      }

      const [courses, total] = await Promise.all([
        this.prisma.course.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          include: { details: true },
        }),
        this.prisma.course.count({ where }),
      ]);

      return {
        items: courses.map(course => this.mapToCourseRecord(course)),
        total,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Failed to find enrolled courses: ${error}`);
    }
  }

  async updateApprovalStatus(course: CourseRecord): Promise<CourseRecord> {
    try {
      const updated = await this.prisma.course.update({
        where: { id: course.id },
        data: {
          approvalStatus: course.approvalStatus as any,
          updatedAt: new Date(),
        },
        include: { details: true },
      });

      return this.mapToCourseRecord(updated);
    } catch (error) {
      throw new Error(`Failed to update approval status: ${error}`);
    }
  }

  async findCourseDetails(courseId: string): Promise<CourseDetailsRecord | null> {
    try {
      const details = await this.prisma.courseDetails.findUnique({
        where: { courseId },
      });

      return details ? this.mapToCourseDetailsRecord(details) : null;
    } catch (error) {
      throw new Error(`Failed to find course details: ${error}`);
    }
  }

  async updateCourseDetails(courseId: string, details: CourseDetailsRecord): Promise<CourseDetailsRecord> {
    try {
      const updated = await this.prisma.courseDetails.upsert({
        where: { courseId },
        update: {
          prerequisites: details.prerequisites,
          longDescription: details.longDescription,
          objectives: details.objectives,
          targetAudience: details.targetAudience,
          updatedAt: new Date(),
        },
        create: {
          courseId: courseId,
          prerequisites: details.prerequisites,
          longDescription: details.longDescription,
          objectives: details.objectives,
          targetAudience: details.targetAudience,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return this.mapToCourseDetailsRecord(updated);
    } catch (error) {
      throw new Error(`Failed to update course details: ${error}`);
    }
  }

  async getCourseStats(options: { userId?: string }): Promise<{
    totalCourses: number;
    publishedCourses: number;
    draftCourses: number;
    totalEnrollments: number;
    totalRevenue: number;
  }> {
    try {
      const { userId } = options;

      const where: Prisma.CourseWhereInput = { deletedAt: null };
      if (userId) {
        where.createdBy = userId;
      }

      const [
        totalCourses,
        publishedCourses,
        draftCourses,
        totalEnrollments,
        totalRevenue,
      ] = await Promise.all([
        this.prisma.course.count({ where }),
        this.prisma.course.count({ where: { ...where, status: "PUBLISHED" } }),
        this.prisma.course.count({ where: { ...where, status: "DRAFT" } }),
        this.prisma.enrollment.count({
          where: {
            course: where,
            accessStatus: "ACTIVE",
          },
        }),
        this.prisma.transactionHistory.aggregate({
          where: {
            course: where,
            type: "PURCHASE",
            status: "COMPLETED",
          },
          _sum: { amount: true },
        }),
      ]);

      return {
        totalCourses,
        publishedCourses,
        draftCourses,
        totalEnrollments,
        totalRevenue: totalRevenue._sum.amount || 0,
      };
    } catch (error) {
      throw new Error(`Failed to get course stats: ${error}`);
    }
  }

  async getTopEnrolledCourses(options: { limit?: number }): Promise<{
    courseId: string;
    title: string;
    enrollments: number;
    revenue: number;
  }[]> {
    try {
      const { limit = 10 } = options;

      const courses = await this.prisma.course.findMany({
        where: {
          deletedAt: null,
          status: "PUBLISHED",
        },
        include: {
          enrollments: {
            where: { accessStatus: "ACTIVE" },
          },
          transactions: {
            where: {
              type: "PURCHASE",
              status: "COMPLETED",
            },
          },
        },
        orderBy: {
          enrollments: {
            _count: "desc",
          },
        },
        take: limit,
      });

      return courses.map(course => ({
        courseId: course.id,
        title: course.title,
        enrollments: course.enrollments.length,
        revenue: course.transactions.reduce((sum, t) => sum + t.amount, 0),
      }));
    } catch (error) {
      throw new Error(`Failed to get top enrolled courses: ${error}`);
    }
  }

  private mapToCourseRecord(prismaCourse: any): CourseRecord {
    return {
      id: prismaCourse.id,
      title: prismaCourse.title,
      description: prismaCourse.description,
      level: prismaCourse.level,
      price: prismaCourse.price ? Number(prismaCourse.price) : null,
      thumbnail: prismaCourse.thumbnail,
      duration: prismaCourse.duration,
      offer: prismaCourse.offer ? Number(prismaCourse.offer) : null,
      status: prismaCourse.status,
      categoryId: prismaCourse.categoryId,
      createdBy: prismaCourse.createdBy,
      createdAt: prismaCourse.createdAt,
      updatedAt: prismaCourse.updatedAt,
      deletedAt: prismaCourse.deletedAt,
      approvalStatus: prismaCourse.approvalStatus,
      adminSharePercentage: Number(prismaCourse.adminSharePercentage),
    };
  }

  private mapToCourseDetailsRecord(prismaDetails: any): CourseDetailsRecord {
    return {
      id: prismaDetails.id,
      courseId: prismaDetails.courseId,
      prerequisites: prismaDetails.prerequisites,
      longDescription: prismaDetails.longDescription,
      objectives: prismaDetails.objectives,
      targetAudience: prismaDetails.targetAudience,
      createdAt: prismaDetails.createdAt,
      updatedAt: prismaDetails.updatedAt,
    };
  }
}
