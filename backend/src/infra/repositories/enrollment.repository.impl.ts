import { PrismaClient } from "@prisma/client";
import {
  ICreateEnrollmentInputDTO,
  IEnrollmentOutputDTO,
} from "../../domain/dtos/course/course.dto";
import { HttpError } from "../../presentation/http/utils/HttpErrors";
import { IEnrollmentRepository } from "../../app/repositories/enrollment.repository.interface";

export class EnrollmentRepository implements IEnrollmentRepository {
  constructor(private prisma: PrismaClient) {}

  async findByUserAndCourse(
    userId: string,
    courseId: string
  ): Promise<IEnrollmentOutputDTO | null> {
    try {
      const enrollment = await this.prisma.enrollment.findFirst({
        where: { userId, courseId },
      });
      if (!enrollment) return null;
      return {
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        enrolledAt: enrollment.enrolledAt.toISOString(),
      };
    } catch (error) {
      console.error("Error finding enrollment", { error, userId, courseId });
      throw new HttpError("Failed to find enrollment", 500);
    }
  }

  async create(
    input: ICreateEnrollmentInputDTO
  ): Promise<IEnrollmentOutputDTO[]> {
    try {
      const enrollments = await Promise.all(
        input.courseIds.map(async (courseId) => {
          const enrollment = await this.prisma.enrollment.create({
            data: {
              userId: input.userId,
              courseId,
              enrolledAt: new Date(),
            },
          });
          return {
            userId: enrollment.userId,
            courseId: enrollment.courseId,
            enrolledAt: enrollment.enrolledAt.toISOString(),
          };
        })
      );
      return enrollments;
    } catch (error) {
      console.error("Error creating enrollments", { error, input });
      throw new HttpError("Failed to create enrollments", 500);
    }
  }
}
