import { PrismaClient } from "@prisma/client";
import {
  ICreateEnrollmentInputDTO,
  IEnrollmentOutputDTO,
} from "../../domain/dtos/course/course.dto";
import { IEnrollmentRepository } from "../../app/repositories/enrollment.repository.interface";
import { HttpError } from "../../presentation/http/errors/http-error";
import { Enrollment } from "../../domain/entities/enrollment.entity";

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

  async create(input: ICreateEnrollmentInputDTO): Promise<IEnrollmentOutputDTO[]> {
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
  }

  async findByUserIdAndCourseIds(userId: string, courseIds: string[]): Promise<Enrollment[]> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        userId,
        courseId: { in: courseIds },
      },
    });
    return enrollments.map(enrollment => new Enrollment(
      `${enrollment.userId}-${enrollment.courseId}`,
      enrollment.userId,
      enrollment.courseId,
      enrollment.enrolledAt
    ));
  }

  async findByUserId(userId: string): Promise<Enrollment[]> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId },
    });
    return enrollments.map(enrollment => new Enrollment(
      `${enrollment.userId}-${enrollment.courseId}`,
      enrollment.userId,
      enrollment.courseId,
      enrollment.enrolledAt
    ));
  }

  async findByCourseId(courseId: string): Promise<Enrollment[]> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { courseId },
    });
    return enrollments.map(enrollment => new Enrollment(
      `${enrollment.userId}-${enrollment.courseId}`,
      enrollment.userId,
      enrollment.courseId,
      enrollment.enrolledAt
    ));
  }

  async delete(userId: string, courseId: string): Promise<void> {
    await this.prisma.enrollment.delete({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
  }
}
