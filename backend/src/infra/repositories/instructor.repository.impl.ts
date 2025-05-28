import { PrismaClient } from "@prisma/client";
import { Instructor } from "../../domain/entities/instructor.entity";
import { APPROVALSTATUS } from "../../domain/enum/approval-status.enum";
import { IInstructorRepository } from "../../app/repositories/instructor.repository";

export class InstructorRepository implements IInstructorRepository {
  constructor(private prisma: PrismaClient) {}

  async createInstructor(instructor: Instructor): Promise<Instructor> {
    const upserted = await this.prisma.instructorDetails.upsert({
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

    return Instructor.fromPrisma(upserted);
  }

  async updateInstructor(instructor: Instructor): Promise<Instructor> {
    const updated = await this.prisma.instructorDetails.update({
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
    return Instructor.fromPrisma(updated);
  }

  async findInstructorById(id: string): Promise<Instructor | null> {
    const instructor = await this.prisma.instructorDetails.findUnique({
      where: { id },
    });
    if (!instructor) return null;
    return Instructor.fromPrisma(instructor);
  }

  async findInstructorByUserId(userId: string): Promise<Instructor | null> {
    const instructor = await this.prisma.instructorDetails.findUnique({
      where: { userId },
    });
    if (!instructor) return null;
    return Instructor.fromPrisma(instructor);
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
    const where: any = {
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
    let orderBy: any = {};
    if (sortBy) {
      if (sortBy.startsWith("user.")) {
        const field = sortBy.split(".")[1];
        orderBy = { user: { [field]: sortOrder } };
      } else {
        orderBy = { [sortBy]: sortOrder };
      }
    }

    // Get total count
    const total = await this.prisma.instructorDetails.count({ where });

    // Get paginated results
    const instructors = await this.prisma.instructorDetails.findMany({
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
      items: instructors.map(instructor => Instructor.fromPrisma(instructor)),
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
