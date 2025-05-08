import { PrismaClient } from "@prisma/client";
import { IEnrollmentRepository } from "./enrollment.repository.interface";
import { IEnrollment } from "./enrollment.types";

export class EnrollmentRepository implements IEnrollmentRepository {
  constructor(private prisma: PrismaClient) {}

  async createEnrollment(
    userId: string,
    courseId: string
  ): Promise<IEnrollment> {
    return this.prisma.enrollment.create({
      data: {
        userId,
        courseId,
        accessStatus: "ACTIVE",
      },
    }) as unknown as Promise<IEnrollment>;
  }

  async findEnrollment(
    userId: string,
    courseId: string
  ): Promise<IEnrollment | null> {
    return this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    }) as unknown as Promise<IEnrollment | null>;
  }

  async updateAccessStatus(
    userId: string,
    courseId: string,
    accessStatus: "ACTIVE" | "BLOCKED" | "EXPIRED"
  ): Promise<IEnrollment> {
    return this.prisma.enrollment.update({
      where: { userId_courseId: { userId, courseId } },
      data: { accessStatus },
    }) as unknown as Promise<IEnrollment>;
  }
}
