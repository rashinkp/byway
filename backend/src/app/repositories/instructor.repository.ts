import { Instructor } from "../../domain/entities/instructor.entity";
import { APPROVALSTATUS } from "../../domain/enum/approval-status.enum";
import { PrismaClient } from "@prisma/client";

export interface IInstructorRepository {
  createInstructor(instructor: Instructor): Promise<Instructor>;
  updateInstructor(instructor: Instructor): Promise<Instructor>;
  findInstructorById(id: string): Promise<Instructor | null>;
  findInstructorByUserId(userId: string): Promise<Instructor | null>;
  findAllInstructors(
    page: number,
    limit: number,
    options: {
      search?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
      filterBy?: "All" | "Pending" | "Approved" | "Declined";
      includeDeleted?: boolean;
    }
  ): Promise<{ items: Instructor[]; total: number; totalPages: number }>;
}

export class PrismaInstructorRepository implements IInstructorRepository {
  constructor(private prisma: PrismaClient) {}

  async createInstructor(instructor: Instructor): Promise<Instructor> {
    const data = {
      id: instructor.id,
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
      createdAt: instructor.createdAt,
      updatedAt: instructor.updatedAt,
    };

    const created = await this.prisma.instructorDetails.create({
      data,
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

    return Instructor.create({
      userId: created.userId,
      areaOfExpertise: created.areaOfExpertise,
      professionalExperience: created.professionalExperience,
      about: created.about || undefined,
      website: created.website || undefined,
      education: created.education,
      certifications: created.certifications,
      cv: created.cv,
    });
  }

  async updateInstructor(instructor: Instructor): Promise<Instructor> {
    const data = {
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
    };

    const updated = await this.prisma.instructorDetails.update({
      where: { id: instructor.id },
      data,
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

    return Instructor.create({
      userId: updated.userId,
      areaOfExpertise: updated.areaOfExpertise,
      professionalExperience: updated.professionalExperience,
      about: updated.about || undefined,
      website: updated.website || undefined,
      education: updated.education,
      certifications: updated.certifications,
      cv: updated.cv,
    });
  }

  async findInstructorById(id: string): Promise<Instructor | null> {
    const instructor = await this.prisma.instructorDetails.findUnique({
      where: { id },
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

    if (!instructor) return null;

    return Instructor.create({
      userId: instructor.userId,
      areaOfExpertise: instructor.areaOfExpertise,
      professionalExperience: instructor.professionalExperience,
      about: instructor.about || undefined,
      website: instructor.website || undefined,
      education: instructor.education,
      certifications: instructor.certifications,
      cv: instructor.cv,
    });
  }

  async findInstructorByUserId(userId: string): Promise<Instructor | null> {
    const instructor = await this.prisma.instructorDetails.findFirst({
      where: { userId },
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

    if (!instructor) return null;

    return Instructor.create({
      userId: instructor.userId,
      areaOfExpertise: instructor.areaOfExpertise,
      professionalExperience: instructor.professionalExperience,
      about: instructor.about || undefined,
      website: instructor.website || undefined,
      education: instructor.education,
      certifications: instructor.certifications,
      cv: instructor.cv,
    });
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
      deletedAt: includeDeleted ? undefined : null,
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
      items: instructors.map(instructor => Instructor.create({
        userId: instructor.userId,
        areaOfExpertise: instructor.areaOfExpertise,
        professionalExperience: instructor.professionalExperience,
        about: instructor.about || undefined,
        website: instructor.website || undefined,
        education: instructor.education,
        certifications: instructor.certifications,
        cv: instructor.cv,
      })),
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
