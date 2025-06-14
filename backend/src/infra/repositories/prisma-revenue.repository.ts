import { PrismaClient } from "@prisma/client";
import { IRevenueRepository } from "../../app/repositories/revenue.repository";
import { TransactionStatus } from "../../domain/enum/transaction-status.enum";
import { TransactionType } from "../../domain/enum/transaction-type.enum";
import { RevenueMetrics, RevenueByCourse, RevenueByInstructor } from "../../domain/entities/revenue.entity";

export class PrismaRevenueRepository implements IRevenueRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getTransactionAmounts(params: {
    startDate: Date;
    endDate: Date;
    type: TransactionType;
    status: TransactionStatus;
  }): Promise<{ amount: number }> {
    const result = await this.prisma.transactionHistory.aggregate({
      where: {
        status: params.status,
        type: params.type,
        createdAt: {
          gte: params.startDate,
          lte: params.endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return { amount: result._sum.amount || 0 };
  }

  async getTransactionCounts(params: {
    startDate: Date;
    endDate: Date;
    type?: TransactionType;
    status?: TransactionStatus;
  }): Promise<number> {
    return this.prisma.transactionHistory.count({
      where: {
        ...(params.type && { type: params.type }),
        ...(params.status && { status: params.status }),
        createdAt: {
          gte: params.startDate,
          lte: params.endDate,
        },
      },
    });
  }

  async getCourseTransactions(params: {
    startDate: Date;
    endDate: Date;
    status: TransactionStatus;
    type: TransactionType;
  }): Promise<Array<{ courseId: string; amount: number; count: number }>> {
    return this.prisma.transactionHistory.groupBy({
      by: ['courseId'],
      where: {
        status: params.status,
        type: params.type,
        createdAt: {
          gte: params.startDate,
          lte: params.endDate,
        },
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    }).then(results => 
      results.map(r => ({
        courseId: r.courseId!,
        amount: r._sum.amount || 0,
        count: r._count.id
      }))
    );
  }

  async getInstructorCourses(params: {
    courseIds: string[];
  }): Promise<Array<{ courseId: string; instructorId: string; instructorName: string }>> {
    const courses = await this.prisma.course.findMany({
      where: {
        id: { in: params.courseIds },
      },
      select: {
        id: true,
        createdBy: true,
        creator: {
          select: {
            name: true,
          },
        },
      },
    });

    return courses.map(course => ({
      courseId: course.id,
      instructorId: course.createdBy,
      instructorName: course.creator.name,
    }));
  }

  async getCourseDetails(params: {
    courseIds: string[];
  }): Promise<Array<{ id: string; title: string }>> {
    return this.prisma.course.findMany({
      where: {
        id: { in: params.courseIds },
      },
      select: {
        id: true,
        title: true,
      },
    });
  }

  async getRevenueMetrics(params: {
    startDate: Date;
    endDate: Date;
    adminSharePercentage: number;
  }): Promise<RevenueMetrics> {
    const [purchaseAmount, refundAmount] = await Promise.all([
      this.getTransactionAmounts({
        startDate: params.startDate,
        endDate: params.endDate,
        type: TransactionType.PURCHASE,
        status: TransactionStatus.COMPLETED,
      }),
      this.getTransactionAmounts({
        startDate: params.startDate,
        endDate: params.endDate,
        type: TransactionType.REFUND,
        status: TransactionStatus.COMPLETED,
      }),
    ]);

    return RevenueMetrics.create({
      totalRevenue: purchaseAmount.amount,
      adminSharePercentage: params.adminSharePercentage,
      refundedAmount: refundAmount.amount,
      period: {
        start: params.startDate,
        end: params.endDate,
      },
    });
  }

  async getRevenueByCourse(params: {
    startDate: Date;
    endDate: Date;
    adminSharePercentage: number;
  }): Promise<RevenueByCourse[]> {
    const courseTransactions = await this.getCourseTransactions({
      startDate: params.startDate,
      endDate: params.endDate,
      type: TransactionType.PURCHASE,
      status: TransactionStatus.COMPLETED,
    });

    const courseDetails = await this.getCourseDetails({
      courseIds: courseTransactions.map(ct => ct.courseId),
    });

    return courseTransactions.map(ct => {
      const course = courseDetails.find(c => c.id === ct.courseId);
      const totalRevenue = ct.amount;
      const adminShare = totalRevenue * (params.adminSharePercentage / 100);
      const netRevenue = totalRevenue - adminShare;

      return new RevenueByCourse(
        ct.courseId,
        course?.title || 'Unknown Course',
        totalRevenue,
        adminShare,
        netRevenue,
        ct.count
      );
    });
  }

  async getRevenueByInstructor(params: {
    startDate: Date;
    endDate: Date;
    adminSharePercentage: number;
  }): Promise<RevenueByInstructor[]> {
    const courseTransactions = await this.getCourseTransactions({
      startDate: params.startDate,
      endDate: params.endDate,
      type: TransactionType.PURCHASE,
      status: TransactionStatus.COMPLETED,
    });

    const instructorDetails = await this.getInstructorCourses({
      courseIds: courseTransactions.map(ct => ct.courseId),
    });

    const instructorMap = new Map<string, RevenueByInstructor>();

    courseTransactions.forEach(ct => {
      const instructor = instructorDetails.find(id => id.courseId === ct.courseId);
      if (!instructor) return;

      const totalRevenue = ct.amount;
      const adminShare = totalRevenue * (params.adminSharePercentage / 100);
      const netRevenue = totalRevenue - adminShare;

      const existing = instructorMap.get(instructor.instructorId);
      if (existing) {
        existing.totalRevenue += totalRevenue;
        existing.adminShare += adminShare;
        existing.netRevenue += netRevenue;
        existing.courseCount += 1;
      } else {
        instructorMap.set(
          instructor.instructorId,
          new RevenueByInstructor(
            instructor.instructorId,
            instructor.instructorName,
            totalRevenue,
            adminShare,
            netRevenue,
            1
          )
        );
      }
    });

    return Array.from(instructorMap.values());
  }

  async getTransactionStats(params: {
    startDate: Date;
    endDate: Date;
  }): Promise<{
    totalTransactions: number;
    successfulTransactions: number;
    failedTransactions: number;
    refundedTransactions: number;
    averageTransactionAmount: number;
  }> {
    const [
      total,
      successful,
      failed,
      refunded,
      purchaseAmount
    ] = await Promise.all([
      this.getTransactionCounts(params),
      this.getTransactionCounts({
        ...params,
        type: TransactionType.PURCHASE,
        status: TransactionStatus.COMPLETED,
      }),
      this.getTransactionCounts({
        ...params,
        status: TransactionStatus.FAILED,
      }),
      this.getTransactionCounts({
        ...params,
        type: TransactionType.REFUND,
      }),
      this.getTransactionAmounts({
        ...params,
        type: TransactionType.PURCHASE,
        status: TransactionStatus.COMPLETED,
      }),
    ]);

    return {
      totalTransactions: total,
      successfulTransactions: successful,
      failedTransactions: failed,
      refundedTransactions: refunded,
      averageTransactionAmount: successful > 0 ? purchaseAmount.amount / successful : 0,
    };
  }
} 