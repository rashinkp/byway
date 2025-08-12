import { PrismaClient, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { Course, CourseDetails } from "../../domain/entities/course.entity";
import { CourseLevel } from "../../domain/enum/course-level.enum";
import { Price } from "../../domain/value-object/price";
import { Duration } from "../../domain/value-object/duration";
import { Offer } from "../../domain/value-object/offer";
import { CourseStatus } from "../../domain/enum/course-status.enum";
import { APPROVALSTATUS } from "../../domain/enum/approval-status.enum";
import { ICourseRepository } from "../../app/repositories/course.repository.interface";
import { HttpError } from "../../presentation/http/errors/http-error";
import { IGetTopEnrolledCoursesInput } from "../../app/usecases/course/interfaces/top-enrolled-courses.usecase.interface";
import { CourseOverallStats, CourseStats } from "../../domain/types/course-stats.interface";import { FilterCourse, PaginatedResult } from "../../domain/types/pagination-filter.interface";
import { CourseStatsInput, CourseWithEnrollment } from "../../domain/types/course.interface";
export class CourseRepository implements ICourseRepository {
  constructor(private prisma: PrismaClient) {}

  private async transformCourseToEnrollmentData(
    course: Course,
    userId?: string
  ): Promise<CourseWithEnrollment> {
    const courseData = course.toJSON();
    
    // Get instructor data
    const instructor = await this.prisma.user.findUnique({
      where: { id: courseData.createdBy },
      select: { id: true, name: true, email: true, userProfile: true }
    });

    // Get review stats
    const reviews = await this.prisma.courseReview.findMany({
      where: { courseId: courseData.id, deletedAt: null },
      select: { rating: true }
    });

    const rating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    // Check if user is enrolled (if userId is provided)
    const isEnrolled = userId ? await this.prisma.enrollment.findFirst({
      where: { userId, courseId: courseData.id }
    }).then(enrollment => !!enrollment) : false;

    // Check if course is in cart (if userId is provided)
    const isInCart = userId ? await this.prisma.cart.findFirst({
      where: { userId, courseId: courseData.id }
    }).then(cart => !!cart) : false;

    return {
      ...courseData,
      isEnrolled,
      isInCart,
      instructor: instructor ? {
        id: instructor.id,
        name: instructor.name,
        email: instructor.email,
        profile: instructor.userProfile
      } : null,
      reviewStats: {
        rating,
        reviewCount: reviews.length
      }
    };
  }

  async save(course: Course): Promise<Course> {
    try {
      const data: Prisma.CourseCreateInput = {
        id: course.id,
        title: course.title,
        description: course.description,
        level: course.level,
        price: course.price?.getValue(),
        thumbnail: course.thumbnail,
        duration: course.duration?.getValue()
          ? Number(course.duration.getValue())
          : null,
        offer: course.offer?.getValue(),
        status: course.status,
        adminSharePercentage: course.adminSharePercentage,
        category: {
          connect: { id: course.categoryId },
        },
        creator: {
          connect: { id: course.createdBy },
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
          ? new CourseDetails({
              prerequisites: saved.details.prerequisites,
              longDescription: saved.details.longDescription,
              objectives: saved.details.objectives,
              targetAudience: saved.details.targetAudience,
            })
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
          ? new CourseDetails({
              prerequisites: course.details.prerequisites,
              longDescription: course.details.longDescription,
              objectives: course.details.objectives,
              targetAudience: course.details.targetAudience,
            })
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
          ? new CourseDetails({
              prerequisites: course.details.prerequisites,
              longDescription: course.details.longDescription,
              objectives: course.details.objectives,
              targetAudience: course.details.targetAudience,
            })
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

  async findAll(
    input: FilterCourse
  ): Promise<PaginatedResult<CourseWithEnrollment>> {
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
        ? includeDeleted
          ? {}
          : { deletedAt: null }
        : // Instructor can only see their own courses
        role === "INSTRUCTOR"
        ? { createdBy: userId, ...(includeDeleted ? {} : { deletedAt: null }) }
        : // Regular users can only see published, verified and non-deleted courses
          {
            deletedAt: null,
            status: CourseStatus.PUBLISHED,
            approvalStatus: APPROVALSTATUS.APPROVED,
          }),

      // Filter by active/inactive status
      ...(filterBy === "Active" ? { deletedAt: null } : {}),
      ...(filterBy === "Inactive" ? { deletedAt: { not: null } } : {}),

      // Filter by approval status
      ...(filterBy === "Approved"
        ? { approvalStatus: APPROVALSTATUS.APPROVED }
        : {}),
      ...(filterBy === "Declined"
        ? { approvalStatus: APPROVALSTATUS.DECLINED }
        : {}),
      ...(filterBy === "Pending"
        ? { approvalStatus: APPROVALSTATUS.PENDING }
        : {}),

      // Filter by publish status
      ...(filterBy === "Published" ? { status: CourseStatus.PUBLISHED } : {}),
      ...(filterBy === "Draft" ? { status: CourseStatus.DRAFT } : {}),
      ...(filterBy === "Archived" ? { status: CourseStatus.ARCHIVED } : {}),

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
              ? new CourseDetails({
                  prerequisites: course.details.prerequisites,
                  longDescription: course.details.longDescription,
                  objectives: course.details.objectives,
                  targetAudience: course.details.targetAudience,
                })
              : null,
          })
      );

      // Transform courses to include enrollment and additional data
      const coursesWithEnrollment = await Promise.all(
        courseEntities.map(course => this.transformCourseToEnrollmentData(course, input.userId))
      );

      return {
        items: coursesWithEnrollment,
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
      const data: Prisma.CourseUpdateInput = {
        title: course.title,
        description: course.description,
        level: course.level,
        price: course.price?.getValue(),
        thumbnail: course.thumbnail,
        duration: course.duration?.getValue()
          ? Number(course.duration.getValue())
          : null,
        offer: course.offer?.getValue(),
        status: course.status,
        category: course.categoryId
          ? { connect: { id: course.categoryId } }
          : undefined,
        adminSharePercentage: course.adminSharePercentage
          ? new Decimal(course.adminSharePercentage.toString())
          : undefined,
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
        adminSharePercentage: updated.adminSharePercentage?.toNumber() ?? 0,
        details: updated.details
          ? new CourseDetails({
              prerequisites: updated.details.prerequisites,
              longDescription: updated.details.longDescription,
              objectives: updated.details.objectives,
              targetAudience: updated.details.targetAudience,
            })
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
          ? new CourseDetails({
              prerequisites: updated.details.prerequisites,
              longDescription: updated.details.longDescription,
              objectives: updated.details.objectives,
              targetAudience: updated.details.targetAudience,
            })
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
    input: FilterCourse
  ): Promise<PaginatedResult<CourseWithEnrollment>> {
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
              ? new CourseDetails({
                  prerequisites: course.details.prerequisites,
                  longDescription: course.details.longDescription,
                  objectives: course.details.objectives,
                  targetAudience: course.details.targetAudience,
                })
              : null,
          })
      );

      // Transform courses to include enrollment and additional data
      const coursesWithEnrollment = await Promise.all(
        courseEntities.map(course => this.transformCourseToEnrollmentData(course, input.userId))
      );

      return {
        items: coursesWithEnrollment,
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
          ? new CourseDetails({
              prerequisites: updated.details.prerequisites,
              longDescription: updated.details.longDescription,
              objectives: updated.details.objectives,
              targetAudience: updated.details.targetAudience,
            })
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

  async findCourseDetails(courseId: string): Promise<CourseDetails | null> {
    try {
      const details = await this.prisma.courseDetails.findUnique({
        where: { courseId },
      });

      if (!details) return null;

      return new CourseDetails({
        prerequisites: details.prerequisites,
        longDescription: details.longDescription,
        objectives: details.objectives,
        targetAudience: details.targetAudience,
      });
    } catch (error) {
      console.error("Error retrieving course details", { error, courseId });
      throw new HttpError("Failed to retrieve course details", 500);
    }
  }

  async updateCourseDetails(
    courseId: string,
    details: CourseDetails
  ): Promise<CourseDetails> {
    try {
      const updatedDetails = await this.prisma.courseDetails.upsert({
        where: { courseId },
        create: {
          courseId,
          prerequisites: details.prerequisites,
          longDescription: details.longDescription,
          objectives: details.objectives,
          targetAudience: details.targetAudience,
        },
        update: {
          prerequisites: details.prerequisites,
          longDescription: details.longDescription,
          objectives: details.objectives,
          targetAudience: details.targetAudience,
        },
      });

      return new CourseDetails({
        prerequisites: updatedDetails.prerequisites,
        longDescription: updatedDetails.longDescription,
        objectives: updatedDetails.objectives,
        targetAudience: updatedDetails.targetAudience,
      });
    } catch (error) {
      console.error("Error updating course details", {
        error,
        courseId,
        details,
      });
      throw new HttpError("Failed to update course details", 500);
    }
  }

  async getCourseStats(input: CourseStatsInput): Promise<CourseOverallStats> {
    const { userId, includeDeleted = false, isAdmin = false } = input;

    // Build where clause for filtering
    const whereClause: Prisma.CourseWhereInput = {};

    // Filter by instructor if userId is provided
    if (userId) {
      whereClause.createdBy = userId;
    }

    // Handle deleted courses
    if (!includeDeleted) {
      whereClause.deletedAt = null;
    }

    // Build where clause for active courses (non-deleted)
    const activeWhereClause: Prisma.CourseWhereInput = {
      ...whereClause,
      deletedAt: null,
    };

    // Build where clause for inactive courses (deleted)
    const inactiveWhereClause: Prisma.CourseWhereInput = {
      ...whereClause,
      deletedAt: { not: null },
    };

    // Build where clause for pending courses (non-deleted)
    const pendingWhereClause: Prisma.CourseWhereInput = {
      ...whereClause,
      approvalStatus: APPROVALSTATUS.PENDING,
      deletedAt: null,
    };

    if (!isAdmin) {
      // Original behavior for non-admin users
      const [totalCourses, activeCourses, inactiveCourses, pendingCourses] =
        await Promise.all([
          this.prisma.course.count({ where: whereClause }),
          this.prisma.course.count({ where: activeWhereClause }),
          this.prisma.course.count({ where: inactiveWhereClause }),
          this.prisma.course.count({ where: pendingWhereClause }),
        ]);

      return {
        totalCourses,
        activeCourses,
        inactiveCourses,
        pendingCourses,
        approvedCourses: 0,
        declinedCourses: 0,
        publishedCourses: 0,
        draftCourses: 0,
        archivedCourses: 0,
      };
    } else {
      // Comprehensive stats for admin
      const [
        totalCourses,
        activeCourses,
        inactiveCourses,
        pendingCourses,
        approvedCourses,
        declinedCourses,
        publishedCourses,
        draftCourses,
        archivedCourses,
      ] = await Promise.all([
        // Total courses (including deleted)
        this.prisma.course.count({}),

        // Active courses (not deleted)
        this.prisma.course.count({ where: { deletedAt: null } }),

        // Inactive courses (deleted)
        this.prisma.course.count({ where: { deletedAt: { not: null } } }),

        // Pending courses
        this.prisma.course.count({
          where: { approvalStatus: APPROVALSTATUS.PENDING },
        }),

        // Approved courses
        this.prisma.course.count({
          where: { approvalStatus: APPROVALSTATUS.APPROVED },
        }),

        // Declined courses
        this.prisma.course.count({
          where: { approvalStatus: APPROVALSTATUS.DECLINED },
        }),

        // Published courses
        this.prisma.course.count({ where: { status: CourseStatus.PUBLISHED } }),

        // Draft courses
        this.prisma.course.count({ where: { status: CourseStatus.DRAFT } }),

        // Archived courses
        this.prisma.course.count({ where: { status: CourseStatus.ARCHIVED } }),
      ]);

      return {
        totalCourses,
        activeCourses,
        inactiveCourses,
        pendingCourses,
        approvedCourses,
        declinedCourses,
        publishedCourses,
        draftCourses,
        archivedCourses,
      };
    }
  }

  async getTopEnrolledCourses(
    input: IGetTopEnrolledCoursesInput
  ): Promise<CourseStats[]> {
    let allCourses;
    if (input.role === "INSTRUCTOR") {
      allCourses = await this.prisma.course.findMany({
        where: {
          createdBy: input.userId,
        },
        include: {
          creator: true,
          enrollments: true,
        },
      });
    } else {
      allCourses = await this.prisma.course.findMany({
        include: {
          creator: true,
          enrollments: true,
        },
      });
    }

    if (allCourses.length === 0) {
      return [];
    }

    const topEnrolledCourses = allCourses
      .sort((a, b) => b.enrollments.length - a.enrollments.length)
      .slice(0, input.limit || 5);

    // Step 3: For each course, get revenue through completed order items
    const coursesWithRevenue = await Promise.all(
      topEnrolledCourses.map(async (course) => {
        // Get all completed order items for this course
        const completedOrderItems = await this.prisma.orderItem.findMany({
          where: {
            courseId: course.id,
            order: {
              paymentStatus: "COMPLETED",
              orderStatus: "COMPLETED",
            },
          },
          include: {
            order: true,
          },
        });

        // Calculate revenue based on role
        let totalRevenue = 0;
        if (input.role === "INSTRUCTOR") {
          // For instructor: calculate instructor revenue (remaining amount after admin share)
          totalRevenue = completedOrderItems.reduce((sum, item) => {
            const itemPrice = Number(item.coursePrice);
            const adminSharePercentage = Number(item.adminSharePercentage);
            const adminRevenue = itemPrice * (adminSharePercentage / 100);
            const instructorRevenue = itemPrice - adminRevenue; // Instructor gets the remaining amount
            return sum + instructorRevenue;
          }, 0);
        } else {
          // For admin: calculate admin revenue
          totalRevenue = completedOrderItems.reduce((sum, item) => {
            const itemPrice = Number(item.coursePrice);
            const adminSharePercentage = Number(item.adminSharePercentage);
            const adminRevenue = itemPrice * (adminSharePercentage / 100);
            return sum + adminRevenue;
          }, 0);
        }

        // Get review stats for this course
        const reviews = await this.prisma.courseReview.findMany({
          where: {
            courseId: course.id,
            deletedAt: null, // Only include active reviews
          },
          select: {
            rating: true,
          },
        });

        const rating =
          reviews.length > 0
            ? reviews.reduce(
                (sum: number, review: any) => sum + review.rating,
                0
              ) / reviews.length
            : 0;
        const reviewCount = reviews.length;

        return {
          courseId: course.id,
          courseTitle: course.title,
          instructorName: course.creator?.name || "Unknown",
          enrollmentCount: course.enrollments.length,
          revenue: totalRevenue,
          rating,
          reviewCount,
        };
      })
    );

    // Sort by revenue in descending order
    return coursesWithRevenue.sort((a, b) => b.revenue - a.revenue);
  }
}
