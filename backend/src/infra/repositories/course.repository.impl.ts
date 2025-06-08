import { PrismaClient, Prisma } from "@prisma/client";
import { Course } from "../../domain/entities/course.entity";
import { CourseLevel } from "../../domain/enum/course-level.enum";
import { Price } from "../../domain/value-object/price";
import { Duration } from "../../domain/value-object/duration";
import { Offer } from "../../domain/value-object/offer";
import { CourseStatus } from "../../domain/enum/course-status.enum";
import { APPROVALSTATUS } from "../../domain/enum/approval-status.enum";
import {
  ICourseResponseDTO,
  IGetAllCoursesInputDTO,
  IGetEnrolledCoursesInputDTO,
} from "../../domain/dtos/course/course.dto";
import { Decimal } from "@prisma/client/runtime/library";
import { ICourseRepository } from "../../app/repositories/course.repository.interface";
import { HttpError } from "../../presentation/http/errors/http-error";

export class CourseRepository implements ICourseRepository {
  constructor(private prisma: PrismaClient) {}

  async save(course: Course): Promise<Course> {
    try {
      const data: Prisma.CourseCreateInput = {
        id: course.id,
        title: course.title,
        description: course.description,
        level: course.level,
        price: course.price?.getValue() ?? null,
        thumbnail: course.thumbnail,
        duration: course.duration?.getValue() ?? null,
        offer: course.offer?.getValue() ?? null,
        status: course.status,
        adminSharePercentage: course.adminSharePercentage,
        category: {
          connect: { id: course.categoryId }, // Already fixed from previous issue
        },
        // Replace createdBy with creator
        creator: {
          connect: { id: course.createdBy }, // Use connect to link to the existing user
        },
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        deletedAt: course.deletedAt,
        approvalStatus: course.approvalStatus,
        details: course.details
          ? {
              create: {
                prerequisites: course.details.prerequisites,
                longDescription: course.details.longDescription,
                objectives: course.details.objectives,
                targetAudience: course.details.targetAudience,
              },
            }
          : undefined,
      };

      const saved = await this.prisma.course.create({
        data,
        include: { details: true },
      });

      return new Course({
        id: saved.id,
        title: saved.title,
        description: saved.description,
        level: saved.level as CourseLevel,
        price: saved.price ? Price.create(saved.price.toNumber()) : null,
        thumbnail: saved.thumbnail,
        duration: saved.duration ? Duration.create(saved.duration) : null,
        offer: saved.offer ? Offer.create(saved.offer.toNumber()) : null,
        status: saved.status as CourseStatus,
        categoryId: saved.categoryId,
        createdBy: saved.createdBy,
        createdAt: saved.createdAt,
        updatedAt: saved.updatedAt,
        deletedAt: saved.deletedAt,
        approvalStatus: saved.approvalStatus as APPROVALSTATUS,
        adminSharePercentage: saved.adminSharePercentage.toNumber(),
        details: saved.details
          ? {
              prerequisites: saved.details.prerequisites,
              longDescription: saved.details.longDescription,
              objectives: saved.details.objectives,
              targetAudience: saved.details.targetAudience,
            }
          : null,
      });
    } catch (error) {
      console.error("Error saving course in repository", { error, course });
      throw new HttpError("Failed to save course", 500);
    }
  }
  async findById(id: string): Promise<Course | null> {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id },
        include: { 
          details: true,
          category: true,
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          }
        },
      });

      if (!course) return null;

      return new Course({
        id: course.id,
        title: course.title,
        description: course.description,
        level: course.level as CourseLevel,
        price: course.price ? Price.create(course.price.toNumber()) : null,
        thumbnail: course.thumbnail,
        duration: course.duration ? Duration.create(course.duration) : null,
        offer: course.offer ? Offer.create(course.offer.toNumber()) : null,
        status: course.status as CourseStatus,
        categoryId: course.categoryId,
        createdBy: course.createdBy,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        deletedAt: course.deletedAt,
        approvalStatus: course.approvalStatus as APPROVALSTATUS,
        adminSharePercentage: course.adminSharePercentage.toNumber(),
        details: course.details
          ? {
              prerequisites: course.details.prerequisites,
              longDescription: course.details.longDescription,
              objectives: course.details.objectives,
              targetAudience: course.details.targetAudience,
            }
          : null,
      });
    } catch (error) {
      console.error("Error retrieving course by ID in repository", {
        error,
        id,
      });
      throw new HttpError("Failed to retrieve course", 500);
    }
  }

  async findByName(title: string): Promise<Course | null> {
    try {
      const course = await this.prisma.course.findFirst({
        where: { title: { equals: title, mode: "insensitive" } },
        include: { details: true },
      });

      if (!course) return null;

      return new Course({
        id: course.id,
        title: course.title,
        description: course.description,
        level: course.level as CourseLevel,
        price: course.price ? Price.create(course.price.toNumber()) : null,
        thumbnail: course.thumbnail,
        duration: course.duration ? Duration.create(course.duration) : null,
        offer: course.offer ? Offer.create(course.offer.toNumber()) : null,
        status: course.status as CourseStatus,
        categoryId: course.categoryId,
        createdBy: course.createdBy,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        deletedAt: course.deletedAt,
        approvalStatus: course.approvalStatus as APPROVALSTATUS,
        details: course.details
          ? {
              prerequisites: course.details.prerequisites,
              longDescription: course.details.longDescription,
              objectives: course.details.objectives,
              targetAudience: course.details.targetAudience,
            }
          : null,
      });
    } catch (error) {
      console.error("Error retrieving course by name in repository", {
        error,
        title,
      });
      throw new HttpError("Failed to retrieve course", 500);
    }
  }

  async findAll(input: IGetAllCoursesInputDTO): Promise<ICourseResponseDTO> {
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
      categoryId,
    } = input;

    const where: Prisma.CourseWhereInput = {
      ...(search ? { title: { contains: search, mode: "insensitive" } } : {}),
      // Admin can see all courses including deleted ones if includeDeleted is true
      ...(role === "ADMIN" 
        ? (includeDeleted ? {} : { deletedAt: null })
        // Instructor can only see their own courses
        : role === "INSTRUCTOR"
        ? { createdBy: userId, ...(includeDeleted ? {} : { deletedAt: null }) }
        // Regular users can only see published, verified and non-deleted courses
        : { 
            deletedAt: null, 
            status: CourseStatus.PUBLISHED,
            approvalStatus: APPROVALSTATUS.APPROVED
          }
      ),
      ...(filterBy === "Active" ? { deletedAt: null } : {}),
      ...(filterBy === "Inactive" ? { deletedAt: { not: null } } : {}),
      ...(filterBy === "Declined" ? { approvalStatus: APPROVALSTATUS.DECLINED } : {}),
      ...(myCourses && userId ? { createdBy: userId } : {}),
      ...(level !== "All" ? { level } : {}),
      ...(duration === "Under5" ? { duration: { lte: 5 } } : {}),
      ...(duration === "5to10" ? { duration: { gte: 5, lte: 10 } } : {}),
      ...(duration === "Over10" ? { duration: { gt: 10 } } : {}),
      ...(price === "Free" ? { price: { equals: new Decimal(0) } } : {}),
      ...(price === "Paid" ? { price: { gt: new Decimal(0) } } : {}),
      ...(categoryId ? { categoryId } : {}),
    };

    try {
      const [courses, total] = await Promise.all([
        this.prisma.course.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: { details: true },
        }),
        this.prisma.course.count({ where }),
      ]);

      const courseEntities = courses.map(
        (course) =>
          new Course({
            id: course.id,
            title: course.title,
            description: course.description,
            level: course.level as CourseLevel,
            price: course.price ? Price.create(course.price.toNumber()) : null,
            thumbnail: course.thumbnail,
            duration: course.duration ? Duration.create(course.duration) : null,
            offer: course.offer ? Offer.create(course.offer.toNumber()) : null,
            status: course.status as CourseStatus,
            categoryId: course.categoryId,
            createdBy: course.createdBy,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt,
            deletedAt: course.deletedAt,
            approvalStatus: course.approvalStatus as APPROVALSTATUS,
            details: course.details
              ? {
                  prerequisites: course.details.prerequisites,
                  longDescription: course.details.longDescription,
                  objectives: course.details.objectives,
                  targetAudience: course.details.targetAudience,
                }
              : null,
          })
      );

      return {
        courses: courseEntities.map((course) => course.toJSON()),
        total,
        totalPage: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error("Error retrieving courses in repository", { error, input });
      throw new HttpError("Failed to retrieve courses", 500);
    }
  }

  async update(course: Course): Promise<Course> {
    try {
      const data = {
        title: course.title,
        description: course.description,
        level: course.level,
        price: course.price?.getValue(),
        thumbnail: course.thumbnail,
        duration: course.duration?.getValue(),
        offer: course.offer?.getValue(),
        status: course.status,
        categoryId: course.categoryId,
        details: course.details
          ? {
              upsert: {
                create: {
                  prerequisites: course.details.prerequisites,
                  longDescription: course.details.longDescription,
                  objectives: course.details.objectives,
                  targetAudience: course.details.targetAudience,
                },
                update: {
                  prerequisites: course.details.prerequisites,
                  longDescription: course.details.longDescription,
                  objectives: course.details.objectives,
                  targetAudience: course.details.targetAudience,
                },
              },
            }
          : undefined,
      };

      const updated = await this.prisma.course.update({
        where: { id: course.id },
        data,
        include: { details: true },
      });

      return new Course({
        id: updated.id,
        title: updated.title,
        description: updated.description,
        level: updated.level as CourseLevel,
        price: updated.price ? Price.create(updated.price.toNumber()) : null,
        thumbnail: updated.thumbnail,
        duration: updated.duration ? Duration.create(updated.duration) : null,
        offer: updated.offer ? Offer.create(updated.offer.toNumber()) : null,
        status: updated.status as CourseStatus,
        categoryId: updated.categoryId,
        createdBy: updated.createdBy,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
        deletedAt: updated.deletedAt,
        approvalStatus: updated.approvalStatus as APPROVALSTATUS,
        details: updated.details
          ? {
              prerequisites: updated.details.prerequisites,
              longDescription: updated.details.longDescription,
              objectives: updated.details.objectives,
              targetAudience: updated.details.targetAudience,
            }
          : null,
      });
    } catch (error) {
      console.error("Error updating course in repository", { error, course });
      throw new HttpError("Failed to update course", 500);
    }
  }
  async softDelete(course: Course): Promise<Course> {
    try {
      const updated = await this.prisma.course.update({
        where: { id: course.id },
        data: { deletedAt: course.deletedAt },
        include: { details: true },
      });

      return new Course({
        id: updated.id,
        title: updated.title,
        description: updated.description,
        level: updated.level as CourseLevel,
        price: updated.price ? Price.create(updated.price.toNumber()) : null,
        thumbnail: updated.thumbnail,
        duration: updated.duration ? Duration.create(updated.duration) : null,
        offer: updated.offer ? Offer.create(updated.offer.toNumber()) : null,
        status: updated.status as CourseStatus,
        categoryId: updated.categoryId,
        createdBy: updated.createdBy,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
        deletedAt: updated.deletedAt,
        approvalStatus: updated.approvalStatus as APPROVALSTATUS,
        details: updated.details
          ? {
              prerequisites: updated.details.prerequisites,
              longDescription: updated.details.longDescription,
              objectives: updated.details.objectives,
              targetAudience: updated.details.targetAudience,
            }
          : null,
      });
    } catch (error) {
      console.error("Error soft deleting course in repository", {
        error,
        course,
      });
      throw new HttpError("Failed to soft delete course", 500);
    }
  }

  async findEnrolledCourses(
    input: IGetEnrolledCoursesInputDTO
  ): Promise<ICourseResponseDTO> {
    const {
      userId,
      page = 1,
      limit = 10,
      sortBy = "enrolledAt",
      sortOrder = "desc",
      search = "",
      level = "All",
    } = input;

    const where: Prisma.CourseWhereInput = {
      enrollments: { some: { userId } },
      ...(search ? { title: { contains: search, mode: "insensitive" } } : {}),
      ...(level !== "All" ? { level } : {}),
      deletedAt: null,
      status: CourseStatus.PUBLISHED,
    };

    try {
      const [courses, total] = await Promise.all([
        this.prisma.course.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy:
            sortBy === "enrolledAt"
              ? { enrollments: { _count: sortOrder } }
              : { [sortBy]: sortOrder },
          include: { details: true },
        }),
        this.prisma.course.count({ where }),
      ]);

      const courseEntities = courses.map(
        (course) =>
          new Course({
            id: course.id,
            title: course.title,
            description: course.description,
            level: course.level as CourseLevel,
            price: course.price ? Price.create(course.price.toNumber()) : null,
            thumbnail: course.thumbnail,
            duration: course.duration ? Duration.create(course.duration) : null,
            offer: course.offer ? Offer.create(course.offer.toNumber()) : null,
            status: course.status as CourseStatus,
            categoryId: course.categoryId,
            createdBy: course.createdBy,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt,
            deletedAt: course.deletedAt,
            approvalStatus: course.approvalStatus as APPROVALSTATUS,
            details: course.details
              ? {
                  prerequisites: course.details.prerequisites,
                  longDescription: course.details.longDescription,
                  objectives: course.details.objectives,
                  targetAudience: course.details.targetAudience,
                }
              : null,
          })
      );

      return {
        courses: courseEntities.map((course) => course.toJSON()),
        total,
        totalPage: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error("Error retrieving enrolled courses in repository", {
        error,
        input,
      });
      throw new HttpError("Failed to retrieve enrolled courses", 500);
    }
  }

  async updateApprovalStatus(course: Course): Promise<Course> {
    try {
      const updated = await this.prisma.course.update({
        where: { id: course.id },
        data: { approvalStatus: course.approvalStatus },
        include: { details: true },
      });

      return new Course({
        id: updated.id,
        title: updated.title,
        description: updated.description,
        level: updated.level as CourseLevel,
        price: updated.price ? Price.create(updated.price.toNumber()) : null,
        thumbnail: updated.thumbnail,
        duration: updated.duration ? Duration.create(updated.duration) : null,
        offer: updated.offer ? Offer.create(updated.offer.toNumber()) : null,
        status: updated.status as CourseStatus,
        categoryId: updated.categoryId,
        createdBy: updated.createdBy,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
        deletedAt: updated.deletedAt,
        approvalStatus: updated.approvalStatus as APPROVALSTATUS,
        details: updated.details
          ? {
              prerequisites: updated.details.prerequisites,
              longDescription: updated.details.longDescription,
              objectives: updated.details.objectives,
              targetAudience: updated.details.targetAudience,
            }
          : null,
      });
    } catch (error) {
      console.error("Error updating course approval status in repository", {
        error,
        course,
      });
      throw new HttpError("Failed to update course approval status", 500);
    }
  }
}
