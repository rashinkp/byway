import { PrismaClient } from "@prisma/client";
import {
  ICreateEnrollmentInputDTO,
  IEnrollmentOutputDTO,
} from "../../app/dtos/course/course.dto";
import { IEnrollmentRepository } from "../../app/repositories/enrollment.repository.interface";
import { HttpError } from "../../presentation/http/errors/http-error";
import { Enrollment } from "../../domain/entities/enrollment.entity";
import { IEnrollmentStats } from "../../app/usecases/enrollment/interfaces/get-enrollment-stats.usecase.interface";

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
        orderItemId: enrollment.orderItemId || undefined,
        accessStatus: enrollment.accessStatus,
      };
    } catch (error) {
      console.error("Error finding enrollment", { error, userId, courseId });
      throw new HttpError("Failed to find enrollment", 500);
    }
  }

  async create(
    input: ICreateEnrollmentInputDTO
  ): Promise<IEnrollmentOutputDTO[]> {
    console.log("Creating enrollments with input:", input);
    const enrollments = await Promise.all(
      input.courseIds.map(async (courseId) => {
        console.log("Creating enrollment for course:", courseId);
        try {
          const enrollment = await this.prisma.enrollment.create({
            data: {
              userId: input.userId,
              courseId,
              enrolledAt: new Date(),
              orderItemId: input.orderItemId,
              accessStatus: "ACTIVE",
            },
          });
          console.log("Enrollment created successfully:", enrollment);
          return {
            userId: enrollment.userId,
            courseId: enrollment.courseId,
            enrolledAt: enrollment.enrolledAt.toISOString(),
            orderItemId: enrollment.orderItemId || undefined,
            accessStatus: enrollment.accessStatus,
          };
        } catch (error) {
          console.error("Error creating enrollment:", error);
          throw error;
        }
      })
    );
    console.log("All enrollments created:", enrollments);
    return enrollments;
  }

  async updateAccessStatus(
    userId: string,
    courseId: string,
    status: "ACTIVE" | "BLOCKED" | "EXPIRED"
  ): Promise<void> {
    await this.prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      data: {
        accessStatus: status,
      },
    });
  }

  async findByUserIdAndCourseIds(
    userId: string,
    courseIds: string[]
  ): Promise<Enrollment[]> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        userId,
        courseId: { in: courseIds },
      },
    });
    return enrollments.map(
      (enrollment) =>
        new Enrollment(
          `${enrollment.userId}-${enrollment.courseId}`,
          enrollment.userId,
          enrollment.courseId,
          enrollment.enrolledAt,
          enrollment.orderItemId || undefined,
          enrollment.accessStatus
        )
    );
  }

  async findByUserId(userId: string): Promise<Enrollment[]> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId },
    });
    return enrollments.map(
      (enrollment) =>
        new Enrollment(
          `${enrollment.userId}-${enrollment.courseId}`,
          enrollment.userId,
          enrollment.courseId,
          enrollment.enrolledAt,
          enrollment.orderItemId || undefined,
          enrollment.accessStatus
        )
    );
  }

  async findByCourseId(courseId: string): Promise<Enrollment[]> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { courseId },
      include: {
        orderItem: {
          include: {
            order: true,
          },
        },
      },
    });
    return enrollments.map(
      (enrollment) =>
        new Enrollment(
          `${enrollment.userId}-${enrollment.courseId}`,
          enrollment.userId,
          enrollment.courseId,
          enrollment.enrolledAt,
          enrollment.orderItemId || undefined,
          enrollment.accessStatus
        )
    );
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

  async getEnrollmentStats(): Promise<IEnrollmentStats> {
    const totalEnrollments = await this.prisma.enrollment.count();

    return {
      totalEnrollments,
    };
  }
}
