import { PrismaClient } from "@prisma/client";
import { IInstructorRepository } from "./instructor.repository";
import { Instructor } from "../../domain/entities/instructor.entity";
import { APPROVALSTATUS } from "../../domain/enum/approval-status.enum";
export class InstructorRepository implements IInstructorRepository {
  constructor(private prisma: PrismaClient) {}

  async createInstructor(instructor: Instructor): Promise<Instructor> {
    const created = await this.prisma.instructorDetails.create({
      data: {
        id: instructor.id,
        userId: instructor.userId,
        areaOfExpertise: instructor.areaOfExpertise,
        professionalExperience: instructor.professionalExperience,
        about: instructor.about,
        website: instructor.website,
        status: instructor.status,
        totalStudents: instructor.totalStudents,
        createdAt: instructor.createdAt,
        updatedAt: instructor.updatedAt,
      },
    });
    return Instructor.fromPrisma(created);
  }

  async updateInstructor(instructor: Instructor): Promise<Instructor> {
    const updated = await this.prisma.instructorDetails.update({
      where: { id: instructor.id },
      data: {
        areaOfExpertise: instructor.areaOfExpertise,
        professionalExperience: instructor.professionalExperience,
        about: instructor.about,
        website: instructor.website,
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

  async findAllInstructors(page: number = 1, limit: number = 10, status?: APPROVALSTATUS): Promise<{ items: Instructor[]; total: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const where = status ? { status: { equals: status } } : {};

    const [instructors, total] = await Promise.all([
      this.prisma.instructorDetails.findMany({
        where,
        skip,
        take: limit,
        include: { user: true },
      }),
      this.prisma.instructorDetails.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: instructors.map(Instructor.fromPrisma),
      total,
      totalPages,
    };
  }
}
