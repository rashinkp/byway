import { Course, CourseDetails, Prisma, PrismaClient } from "@prisma/client";
import {
  CourseWithEnrollments,
  CourseWithRelations,
  ICourse,
  ICourseDetails,
  ICreateCourseInput,
  ICreateEnrollmentInput,
  IEnrollment,
  IGetAllCoursesInput,
  IGetEnrolledCoursesInput,
  IUpdateCourseApprovalInput,
  IUpdateCourseInput,
} from "./course.types";
import { AppError } from "../../utils/appError";
import { StatusCodes } from "http-status-codes";
import { ICourseRepository } from "./course.repository.interface";

export class CourseRepository implements ICourseRepository {
  constructor(private prisma: PrismaClient) {}

  async createCourse(input: ICreateCourseInput): Promise<ICourse> {
    const {
      prerequisites,
      longDescription,
      objectives,
      targetAudience,
      ...courseData
    } = input;
    const course = await this.prisma.$transaction(async (tx) => {
      // Create the Course record
      const createdCourse = await tx.course.create({
        data: {
          ...courseData,
          price: courseData.price ? courseData.price : null,
          offer: courseData.offer ? courseData.offer : null,
          duration: courseData.duration, // duration is required
        },
      });

      let createdDetails: CourseDetails | undefined;
      if (prerequisites || longDescription || objectives || targetAudience) {
        createdDetails = await tx.courseDetails.create({
          data: {
            courseId: createdCourse.id,
            prerequisites: prerequisites || null,
            longDescription: longDescription || null,
            objectives: objectives || null,
            targetAudience: targetAudience || null,
          },
        });
      }

      return {
        ...createdCourse,
        price: createdCourse.price?.toNumber() ?? null,
        offer: createdCourse.offer?.toNumber() ?? null,
      };
    });

    return course;
  }

  async getAllCourses(
    input: IGetAllCoursesInput
  ): Promise<{ courses: ICourse[]; total: number; totalPage: number }> {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      includeDeleted = false,
      search = "",
      filterBy = "All",
      userId,
      myCourses = false,
      role = "USER",
      level = "All",
      duration = "All",
      price = "All",
    } = input;

    const allowedSortFields = [
      "title",
      "createdAt",
      "updatedAt",
      "price",
      "duration",
    ];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const where: any = {};

    // Role-based logic
    if (role === "USER") {
      where.status = "PUBLISHED";
      where.deletedAt = null;
      where.approvalStatus = "APPROVED"; // Only show APPROVED courses for users
    } else if (role === "INSTRUCTOR") {
      if (myCourses && userId) {
        where.createdBy = userId;
        // Instructors can see their own PENDING/DECLINED courses
      } else {
        where.approvalStatus = "APPROVED"; // Only show APPROVED courses for other instructors' courses
      }
      if (!includeDeleted) {
        where.deletedAt = null;
      }
    } else if (role === "ADMIN") {
      // Admins can see all courses, including PENDING/DECLINED
      if (!includeDeleted) {
        where.deletedAt = null;
      }
    }

    // Apply filterBy conditions
    if (filterBy === "Active") {
      where.status = "PUBLISHED";
      where.approvalStatus = "APPROVED";
    } else if (filterBy === "Draft") {
      where.status = "DRAFT";
    } else if (filterBy === "Inactive") {
      where.deletedAt = { not: null };
    }

    // Apply search conditions
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Apply level filter
    if (level !== "All") {
      where.level = level;
    }

    // Apply duration filter
    if (duration !== "All") {
      if (duration === "Under5") {
        where.duration = { lte: 5 * 60 };
      } else if (duration === "5to10") {
        where.duration = { gte: 5 * 60, lte: 10 * 60 };
      } else if (duration === "Over10") {
        where.duration = { gte: 10 * 60 };
      }
    }

    // Apply price filter
    if (price !== "All") {
      if (price === "Free") {
        where.offer = { equals: 0 };
      } else if (price === "Paid") {
        where.offer = { gt: 0 };
      }
    }

    const skip = (page - 1) * limit;
    const orderBy = { [safeSortBy]: sortOrder };

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { details: true },
      }),
      this.prisma.course.count({ where }),
    ]);

    const totalPage = Math.ceil(total / limit);

    return {
      courses: courses.map((course) => ({
        id: course.id,
        title: course.title,
        description: course.description || undefined,
        level: course.level,
        price: course.price?.toNumber(),
        thumbnail: course.thumbnail || undefined,
        duration: course.duration || undefined,
        offer: course.offer?.toNumber(),
        status: course.status,
        categoryId: course.categoryId,
        createdBy: course.createdBy,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        deletedAt: course.deletedAt || undefined,
        approvalStatus: course.approvalStatus, // Include approvalStatus
        details: course.details
          ? {
              id: course.details.id,
              courseId: course.details.courseId,
              prerequisites: course.details.prerequisites || undefined,
              longDescription: course.details.longDescription || undefined,
              objectives: course.details.objectives || undefined,
              targetAudience: course.details.targetAudience || undefined,
              createdAt: course.details.createdAt,
              updatedAt: course.details.updatedAt,
            }
          : undefined,
      })),
      total,
      totalPage,
    };
  }

  async getCourseById(courseId: string): Promise<ICourse | null> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { details: true },
    });
    if (!course) return null;
    return {
      id: course.id,
      title: course.title,
      description: course.description || undefined,
      level: course.level,
      price: course.price?.toNumber(),
      thumbnail: course.thumbnail || undefined,
      duration: course.duration || undefined,
      offer: course.offer?.toNumber(),
      status: course.status,
      categoryId: course.categoryId,
      approvalStatus:course.approvalStatus,
      createdBy: course.createdBy,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      deletedAt: course.deletedAt || undefined,
      details: course.details
        ? {
            id: course.details.id,
            courseId: course.details.courseId,
            prerequisites: course.details.prerequisites || undefined,
            longDescription: course.details.longDescription || undefined,
            objectives: course.details.objectives || undefined,
            targetAudience: course.details.targetAudience || undefined,
            createdAt: course.details.createdAt,
            updatedAt: course.details.updatedAt,
          }
        : undefined,
    };
  }

  async getCourseDetails(courseId: string): Promise<ICourseDetails | null> {
    const courseDetails = await this.prisma.courseDetails.findUnique({
      where: { courseId: courseId },
    });

    return courseDetails;
  }

  async getCourseByName(title: string): Promise<ICourse | null> {
    const course = await this.prisma.course.findFirst({
      where: {
        title,
        deletedAt: null,
      },
      include: { details: true },
    });

    if (!course) return null;

    return {
      id: course.id,
      title: course.title,
      description: course.description || undefined,
      level: course.level,
      price: course.price?.toNumber(),
      thumbnail: course.thumbnail || undefined,
      duration: course.duration || undefined,
      offer: course.offer?.toNumber(),
      status: course.status,
      categoryId: course.categoryId,
      createdBy: course.createdBy,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      approvalStatus:course.approvalStatus,
      deletedAt: course.deletedAt || undefined,
      details: course.details
        ? {
            id: course.details.id,
            courseId: course.details.courseId,
            prerequisites: course.details.prerequisites || undefined,
            longDescription: course.details.longDescription || undefined,
            objectives: course.details.objectives || undefined,
            targetAudience: course.details.targetAudience || undefined,
            createdAt: course.details.createdAt,
            updatedAt: course.details.updatedAt,
          }
        : undefined,
    };
  }

  async updateCourse(input: IUpdateCourseInput): Promise<ICourse> {
    const { id, details, status, ...courseData } = input;

    // If the status is being updated to "PUBLISHED", validate lessons
    if (status === "PUBLISHED") {
      // Query lessons for the course
      const lessons = await this.prisma.lesson.findMany({
        where: {
          courseId: id,
          status: "PUBLISHED", // Assuming "PUBLISHED" is the status for published lessons
        },
      });

      // Check if at least one lesson is published
      if (lessons.length === 0) {
        throw new AppError(
          "Cannot publish course: At least one lesson must be published.",
          StatusCodes.BAD_REQUEST,
          "VALIDATION_ERROR"
        );
      }
    }

    // Proceed with the course update
    const course = await this.prisma.course.update({
      where: { id },
      data: {
        ...courseData,
        status,
        updatedAt: new Date(),
        details: details
          ? { upsert: { create: details, update: details } }
          : undefined,
      },
      include: { details: true },
    });

    console.log(course);

    // Transform the response to match ICourse interface
    return {
      id: course.id,
      title: course.title,
      description: course.description || undefined,
      level: course.level,
      price: course.price?.toNumber(),
      thumbnail: course.thumbnail || undefined,
      duration: course.duration || undefined,
      offer: course.offer?.toNumber(),
      status: course.status,
      categoryId: course.categoryId,
      createdBy: course.createdBy,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      approvalStatus:course.approvalStatus,
      deletedAt: course.deletedAt || undefined,
      details: course.details
        ? {
            id: course.details.id,
            courseId: course.details.courseId,
            prerequisites: course.details.prerequisites || undefined,
            longDescription: course.details.longDescription || undefined,
            objectives: course.details.objectives || undefined,
            targetAudience: course.details.targetAudience || undefined,
            createdAt: course.details.createdAt,
            updatedAt: course.details.updatedAt,
          }
        : undefined,
    };
  }

  async softDeleteCourse(
    courseId: string,
    deletedAt: Date | null
  ): Promise<ICourse> {
    const course = await this.prisma.course.update({
      where: { id: courseId },
      data: { deletedAt, updatedAt: new Date() },
      include: { details: true },
    });
    return {
      id: course.id,
      title: course.title,
      description: course.description || undefined,
      level: course.level,
      price: course.price?.toNumber(),
      thumbnail: course.thumbnail || undefined,
      duration: course.duration || undefined,
      offer: course.offer?.toNumber(),
      status: course.status,
      categoryId: course.categoryId,
      createdBy: course.createdBy,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      deletedAt: course.deletedAt || undefined,
      approvalStatus:course.approvalStatus,
      details: course.details
        ? {
            id: course.details.id,
            courseId: course.details.courseId,
            prerequisites: course.details.prerequisites || undefined,
            longDescription: course.details.longDescription || undefined,
            objectives: course.details.objectives || undefined,
            targetAudience: course.details.targetAudience || undefined,
            createdAt: course.details.createdAt,
            updatedAt: course.details.updatedAt,
          }
        : undefined,
    };
  }

  async createEnrollment(input: ICreateEnrollmentInput): Promise<IEnrollment> {
    const { userId, courseIds } = input;

    // Use a transaction to ensure atomicity and return the first enrollment
    const enrollment = await this.prisma.$transaction(async (tx) => {
      const firstEnrollment = await tx.enrollment.create({
        data: {
          userId,
          courseId: courseIds[0],
          enrolledAt: new Date(),
        },
      });

      if (courseIds.length > 1) {
        for (const courseId of courseIds.slice(1)) {
          await tx.enrollment.create({
            data: {
              userId,
              courseId,
              enrolledAt: new Date(),
            },
          });
        }
      }

      return firstEnrollment;
    });

    return {
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      enrolledAt: enrollment.enrolledAt,
    };
  }

  async getEnrollment(
    userId: string,
    courseId: string
  ): Promise<IEnrollment | null> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enrollment) return null;
    return {
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      enrolledAt: enrollment.enrolledAt,
    };
  }

  async getEnrolledCourses(
    input: IGetEnrolledCoursesInput
  ): Promise<{ courses: ICourse[]; total: number; totalPage: number }> {
    const {
      userId,
      page = 1,
      limit = 10,
      sortBy = "enrolledAt",
      sortOrder = "desc",
      search = "",
      level = "All",
    } = input;

    const allowedSortFields = ["title", "enrolledAt", "createdAt"];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "enrolledAt";

    const where: Prisma.CourseWhereInput = {
      enrollments: {
        some: { userId },
      },
      status: "PUBLISHED",
      deletedAt: null,
      approvalStatus: "APPROVED", // Only show APPROVED courses for enrolled courses
    };

    // Apply search conditions
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Apply level filter
    if (level !== "All") {
      where.level = level;
    }

    const skip = (page - 1) * limit;
    const orderBy: Prisma.CourseOrderByWithRelationInput =
      safeSortBy === "enrolledAt"
        ? { enrollments: { _count: sortOrder } }
        : { [safeSortBy]: sortOrder };

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          details: true,
          enrollments: {
            where: { userId },
            select: { enrolledAt: true },
          },
        },
      }) as Promise<CourseWithRelations[]>,
      this.prisma.course.count({ where }),
    ]);

    const totalPage = Math.ceil(total / limit);

    return {
      courses: courses.map((course) => ({
        id: course.id,
        title: course.title,
        description: course.description || undefined,
        level: course.level as "BEGINNER" | "MEDIUM" | "ADVANCED",
        price: course.price ? Number(course.price) : null,
        thumbnail: course.thumbnail || undefined,
        duration: course.duration || undefined,
        offer: course.offer ? Number(course.offer) : null,
        status: course.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
        categoryId: course.categoryId,
        createdBy: course.createdBy,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        deletedAt: course.deletedAt || undefined,
        approvalStatus: course.approvalStatus, // Include approvalStatus
        details: course.details
          ? {
              id: course.details.id,
              courseId: course.details.courseId,
              prerequisites: course.details.prerequisites || undefined,
              longDescription: course.details.longDescription || undefined,
              objectives: course.details.objectives || undefined,
              targetAudience: course.details.targetAudience || undefined,
              createdAt: course.details.createdAt,
              updatedAt: course.details.updatedAt,
            }
          : undefined,
      })),
      total,
      totalPage,
    };
  }

  async updateCourseApproval(
    input: IUpdateCourseApprovalInput
  ): Promise<ICourse> {
    const { courseId, approvalStatus } = input;

    try {
      const course = await this.prisma.course.update({
        where: { id: courseId },
        data: {
          approvalStatus,
          updatedAt: new Date(),
        },
        include: { details: true },
      });

      return {
        id: course.id,
        title: course.title,
        description: course.description || undefined,
        level: course.level,
        price: course.price?.toNumber(),
        thumbnail: course.thumbnail || undefined,
        duration: course.duration || undefined,
        offer: course.offer?.toNumber(),
        status: course.status,
        categoryId: course.categoryId,
        createdBy: course.createdBy,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        deletedAt: course.deletedAt || undefined,
        approvalStatus: course.approvalStatus,
        details: course.details
          ? {
              id: course.details.id,
              courseId: course.details.courseId,
              prerequisites: course.details.prerequisites || undefined,
              longDescription: course.details.longDescription || undefined,
              objectives: course.details.objectives || undefined,
              targetAudience: course.details.targetAudience || undefined,
              createdAt: course.details.createdAt,
              updatedAt: course.details.updatedAt,
            }
          : undefined,
      };
    } catch (error) {
      throw new AppError(
        "Failed to update course approval status",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "DATABASE_ERROR"
      );
    }
  }
}
