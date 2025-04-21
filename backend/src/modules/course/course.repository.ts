import { PrismaClient } from "@prisma/client";
import {
  ICourse,
  ICourseRepository,
  ICreateCourseInput,
  ICreateEnrollmentInput,
  IEnrollment,
  IGetAllCoursesInput,
  IUpdateCourseInput,
} from "./course.types";

export class CourseRepository implements ICourseRepository {
  constructor(private prisma: PrismaClient) {}

  async createCourse(input: ICreateCourseInput): Promise<ICourse> {
    const { details, ...courseData } = input;
    const course = await this.prisma.course.create({
      data: {
        ...courseData,
        details: details ? { create: details } : undefined,
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
    } = input;

    // Build where clause
    const where: any = {
      createdBy: userId,
      ...(includeDeleted ? {} : { deletedAt: null }), // Include or exclude deleted courses
    };

    // Apply filterBy for status
    if (filterBy === "Active") {
      where.status = "PUBLISHED";
    } else if (filterBy === "Draft") {
      where.status = "DRAFT";
    }

    // Apply search filter (title or description)
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const skip = (page - 1) * limit;
    const orderBy = { [sortBy]: sortOrder };

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

  async getCourseById(id: string): Promise<ICourse | null> {
    const course = await this.prisma.course.findUnique({
      where: { id },
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
    const { id, details, ...courseData } = input;
    // console.log(id, details, courseData);
    const course = await this.prisma.course.update({
      where: { id },
      data: {
        ...courseData,
        updatedAt: new Date(),
        details: details
          ? { upsert: { create: details, update: details } }
          : undefined,
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

  async softDeleteCourse(id: string, deletedAt: Date | null): Promise<ICourse> {
    const course = await this.prisma.course.update({
      where: { id },
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
    const enrollment = await this.prisma.enrollment.create({
      data: input,
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
}
