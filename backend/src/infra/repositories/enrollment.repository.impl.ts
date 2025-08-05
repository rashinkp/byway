import { PrismaClient } from "@prisma/client";
import { EnrollmentRecord } from "../../app/records/enrollment.record";
import { IEnrollmentRepository } from "../../app/repositories/enrollment.repository.interface";

export class EnrollmentRepository implements IEnrollmentRepository {
  constructor(private prisma: PrismaClient) {}

  async create(enrollment: EnrollmentRecord): Promise<EnrollmentRecord> {
    try {
      const created = await this.prisma.enrollment.create({
        data: {
          userId: enrollment.userId,
          courseId: enrollment.courseId,
          orderItemId: enrollment.orderItemId,
          enrolledAt: enrollment.enrolledAt,
          accessStatus: enrollment.accessStatus as any,
        },
      });

      return this.mapToEnrollmentRecord(created);
    } catch (error) {
      throw new Error(`Failed to create enrollment: ${error}`);
    }
  }

  async findByUserAndCourse(userId: string, courseId: string): Promise<EnrollmentRecord | null> {
    try {
      const enrollment = await this.prisma.enrollment.findFirst({
        where: { userId, courseId },
      });

      return enrollment ? this.mapToEnrollmentRecord(enrollment) : null;
    } catch (error) {
      throw new Error(`Failed to find enrollment: ${error}`);
    }
  }

  async findByUserId(userId: string): Promise<EnrollmentRecord[]> {
    try {
      const enrollments = await this.prisma.enrollment.findMany({
        where: { userId },
      });

      return enrollments.map(enrollment => this.mapToEnrollmentRecord(enrollment));
    } catch (error) {
      throw new Error(`Failed to find enrollments by user: ${error}`);
    }
  }

  async findByCourseId(courseId: string): Promise<EnrollmentRecord[]> {
    try {
      const enrollments = await this.prisma.enrollment.findMany({
        where: { courseId },
      });

      return enrollments.map(enrollment => this.mapToEnrollmentRecord(enrollment));
    } catch (error) {
      throw new Error(`Failed to find enrollments by course: ${error}`);
    }
  }

  async update(enrollment: EnrollmentRecord): Promise<EnrollmentRecord> {
    try {
      const updated = await this.prisma.enrollment.update({
        where: {
          userId_courseId: {
            userId: enrollment.userId,
            courseId: enrollment.courseId,
          },
        },
        data: {
          orderItemId: enrollment.orderItemId,
          enrolledAt: enrollment.enrolledAt,
          accessStatus: enrollment.accessStatus as any,
        },
      });

      return this.mapToEnrollmentRecord(updated);
    } catch (error) {
      throw new Error(`Failed to update enrollment: ${error}`);
    }
  }

  async delete(userId: string, courseId: string): Promise<void> {
    try {
      await this.prisma.enrollment.delete({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to delete enrollment: ${error}`);
    }
  }

  async getEnrollmentStats(options: { userId?: string }): Promise<{
    totalEnrollments: number;
    activeEnrollments: number;
    completedCourses: number;
    inProgressCourses: number;
  }> {
    try {
      const { userId } = options;

      const where: any = {};
      if (userId) {
        where.userId = userId;
      }

      const [
        totalEnrollments,
        activeEnrollments,
        completedCourses,
        inProgressCourses,
      ] = await Promise.all([
        this.prisma.enrollment.count({ where }),
        this.prisma.enrollment.count({ where: { ...where, accessStatus: "ACTIVE" } }),
        this.prisma.enrollment.count({ where: { ...where, accessStatus: "COMPLETED" } }),
        this.prisma.enrollment.count({ where: { ...where, accessStatus: "IN_PROGRESS" } }),
      ]);

      return {
        totalEnrollments,
        activeEnrollments,
        completedCourses,
        inProgressCourses,
      };
    } catch (error) {
      throw new Error(`Failed to get enrollment stats: ${error}`);
    }
  }

  private mapToEnrollmentRecord(prismaEnrollment: any): EnrollmentRecord {
    return {
      userId: prismaEnrollment.userId,
      courseId: prismaEnrollment.courseId,
      orderItemId: prismaEnrollment.orderItemId,
      enrolledAt: prismaEnrollment.enrolledAt,
      accessStatus: prismaEnrollment.accessStatus,
    };
  }
}
