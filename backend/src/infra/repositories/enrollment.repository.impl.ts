import { PrismaClient } from "@prisma/client";
import { IEnrollmentRepository } from "../../app/repositories/enrollment.repository.interface";
import { HttpError } from "../../presentation/http/errors/http-error";
import { Enrollment } from "../../domain/entities/enrollment.entity";
import { IEnrollmentWithDetails, ICreateEnrollmentInput, IEnrollmentStats, IGetEnrollmentStatsInput } from "../../domain/types/enrollment.interface";

export class EnrollmentRepository implements IEnrollmentRepository {
  constructor(private _prisma: PrismaClient) {}

  async findByUserAndCourse(
    userId: string,
    courseId: string
  ): Promise<IEnrollmentWithDetails | null> {
    try {
      const enrollment = await this._prisma.enrollment.findFirst({
        where: { userId, courseId },
      });
      if (!enrollment) return null;
      return {
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        enrolledAt: enrollment.enrolledAt,
        orderItemId: enrollment.orderItemId || undefined,
        accessStatus: enrollment.accessStatus,
      };
    } catch (error) {
      console.error("Error finding enrollment", { error, userId, courseId });
      throw new HttpError("Failed to find enrollment", 500);
    }
  }

  async create(
    input: ICreateEnrollmentInput
  ): Promise<IEnrollmentWithDetails[]> {
    console.log("Creating enrollments with input:", input);
    const enrollments = await Promise.all(
      input.courseIds.map(async (courseId) => {
        console.log("Creating enrollment for course:", courseId);
        try {
          const enrollment = await this._prisma.enrollment.create({
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
            enrolledAt: enrollment.enrolledAt,
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
    await this._prisma.enrollment.update({
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
    const enrollments = await this._prisma.enrollment.findMany({
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
    const enrollments = await this._prisma.enrollment.findMany({
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
    const enrollments = await this._prisma.enrollment.findMany({
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
    await this._prisma.enrollment.delete({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
  }

  async getEnrollmentStats(input: IGetEnrollmentStatsInput): Promise<IEnrollmentStats> {
    const totalEnrollments = await this._prisma.enrollment.count();
    return {
      totalEnrollments,
    };
  }
}
