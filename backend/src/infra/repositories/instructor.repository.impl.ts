import { PrismaClient } from "@prisma/client";
import { Instructor } from "../../domain/entities/instructor.entity";
import { APPROVALSTATUS } from "../../domain/enum/approval-status.enum";
import { IInstructorRepository } from "../../app/repositories/instructor.repository";
import { IGetTopInstructorsInput } from "../../app/usecases/user/interfaces/get-top-instructors.usecase.interface";
import { InstructorStats } from "../../domain/types/instructor.interface";

export class PrismaInstructorRepository implements IInstructorRepository {
  constructor(private _prisma: PrismaClient) { }
  
  async createInstructor(instructor: Instructor): Promise<Instructor> {
    const upserted = await this._prisma.instructorDetails.upsert({
      where: {
        userId: instructor.userId,
      },
      update: {
        userId: instructor.userId,
        areaOfExpertise: instructor.areaOfExpertise,
        professionalExperience: instructor.professionalExperience,
        about: instructor.about,
        website: instructor.website,
        education: instructor.education,
        certifications: instructor.certifications,
        cv: instructor.cv,
        status: instructor.status,
        totalStudents: instructor.totalStudents,
        updatedAt: new Date(),
      },
      create: {
        userId: instructor.userId,
        areaOfExpertise: instructor.areaOfExpertise,
        professionalExperience: instructor.professionalExperience,
        about: instructor.about,
        website: instructor.website,
        education: instructor.education,
        certifications: instructor.certifications,
        cv: instructor.cv,
        status: instructor.status,
        totalStudents: instructor.totalStudents,
        createdAt: instructor.createdAt || new Date(),
        updatedAt: instructor.updatedAt || new Date(),
      },
    });

    return Instructor.fromPersistence(upserted);
  }

  async updateInstructor(instructor: Instructor): Promise<Instructor> {
    const updated = await this._prisma.instructorDetails.update({
      where: { id: instructor.id },
      data: {
        areaOfExpertise: instructor.areaOfExpertise,
        professionalExperience: instructor.professionalExperience,
        about: instructor.about,
        website: instructor.website,
        education: instructor.education,
        certifications: instructor.certifications,
        cv: instructor.cv,
        status: instructor.status,
        totalStudents: instructor.totalStudents,
        updatedAt: instructor.updatedAt,
      },
    });
    return Instructor.fromPersistence(updated);
  }

  async findInstructorById(id: string): Promise<Instructor | null> {
    const instructor = await this._prisma.instructorDetails.findUnique({
      where: { id },
    });
    if (!instructor) return null;
    return Instructor.fromPersistence(instructor);
  }

  async findInstructorByUserId(userId: string): Promise<Instructor | null> {
    const instructor = await this._prisma.instructorDetails.findUnique({
      where: { userId },
    });
    if (!instructor) return null;
    return Instructor.fromPersistence(instructor);
  }

  async findAllInstructors(
    page: number,
    limit: number,
    options: {
      search?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
      filterBy?: "All" | "Pending" | "Approved" | "Declined";
      includeDeleted?: boolean;
    }
  ): Promise<{ items: Instructor[]; total: number; totalPages: number }> {
    const { search, sortBy, sortOrder, filterBy, includeDeleted } = options;

    // Build where clause
    const where: Record<string, unknown> = {
      user: {
        deletedAt: includeDeleted ? undefined : null,
      },
    };

    // Add status filter
    if (filterBy && filterBy !== "All") {
      where.status = filterBy.toUpperCase() as APPROVALSTATUS;
    }

    // Add search condition if provided
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { areaOfExpertise: { contains: search, mode: "insensitive" } },
      ];
    }

    // Build order by clause
    let orderBy: Record<string, unknown> = {};
    if (sortBy) {
      if (sortBy.startsWith("user.")) {
        const field = sortBy.split(".")[1];
        orderBy = { user: { [field]: sortOrder } };
      } else {
        orderBy = { [sortBy]: sortOrder };
      }
    }

    // Get total count
    const total = await this._prisma.instructorDetails.count({ where });

    // Get paginated results
    const instructors = await this._prisma.instructorDetails.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
          },
        },
      },
    });

    return {
      items: instructors.map((instructor) => Instructor.fromPersistence(instructor)),
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getTopInstructors(
    input: IGetTopInstructorsInput
  ): Promise<InstructorStats[]> {
    const instructors = await this._prisma.user.findMany({
      where: {
        role: "INSTRUCTOR",
        deletedAt: null,
      },
      include: {
        coursesCreated: {
          include: {
            enrollments: true,
          },
        },
      },
      take: input.limit || 5,
    });

    // Calculate metrics for each instructor
    const instructorsWithMetrics = await Promise.all(
      instructors.map(async (instructor) => {
        // Calculate course count
        const courseCount = instructor.coursesCreated.length;

        // Calculate total enrollments across all courses
        const totalEnrollments = instructor.coursesCreated.reduce(
          (sum: number, course: { enrollments: unknown[] }) => {
            return sum + course.enrollments.length;
          },
          0
        );

        // Calculate total revenue from completed order items for instructor's courses
        const courseIds = instructor.coursesCreated.map(
          (course: { id: string }) => course.id
        );
        const completedOrderItems = await this._prisma.orderItem.findMany({
          where: {
            courseId: {
              in: courseIds,
            },
            order: {
              paymentStatus: "COMPLETED",
              orderStatus: "COMPLETED",
            },
          },
        });

    const totalRevenue = completedOrderItems.reduce((sum, item) => {
      const itemPrice = Number(item.coursePrice); // Decimal is converted
      const adminSharePercentage = Number(item.adminSharePercentage);
      const adminRevenue = itemPrice * (adminSharePercentage / 100);
      const instructorRevenue = itemPrice - adminRevenue;
      return sum + instructorRevenue;
    }, 0);


        // Calculate average rating from course reviews
        const reviews = await this._prisma.courseReview.findMany({
          where: {
            courseId: {
              in: courseIds,
            },
            deletedAt: null, // Only include active reviews
          },
          select: {
            rating: true,
          },
        });

        const averageRating =
          reviews.length > 0
            ? reviews.reduce(
                (sum: number, review: { rating: number }) => sum + review.rating,
                0
              ) / reviews.length
            : 0;

        return {
          instructorId: instructor.id,
          instructorName: instructor.name,
          email: instructor.email,
          courseCount,
          totalEnrollments,
          totalRevenue,
          averageRating,
          isActive: instructor.deletedAt === null,
        };
      })
    );

    // Sort by total revenue in descending order
    return instructorsWithMetrics.sort(
      (a, b) => b.totalRevenue - a.totalRevenue
    );
  }
}
