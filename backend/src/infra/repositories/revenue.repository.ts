import { PrismaClient } from "@prisma/client";
import { TransactionType } from "../../domain/enum/transaction-type.enum";
import { TransactionStatus } from "../../domain/enum/transaction-status.enum";
import { IRevenueRepository } from "@/app/repositories/revenue.repository";

export class PrismaRevenueRepository implements IRevenueRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getTransactionAmounts(params: {
    startDate: Date;
    endDate: Date;
    type: TransactionType;
    status: TransactionStatus;
    userId: string;
  }): Promise<{ amount: number }> {
    const result = await this.prisma.transactionHistory.aggregate({
      where: {
        createdAt: {
          gte: params.startDate,
          lte: params.endDate,
        },
        type: params.type,
        status: params.status,
        userId: params.userId,
      },
      _sum: {
        amount: true,
      },
    });

    return {
      amount: result._sum.amount || 0,
    };
  }

  async getTransactionCounts(params: {
    startDate: Date;
    endDate: Date;
    type?: TransactionType;
    status?: TransactionStatus;
    userId: string;
  }): Promise<number> {
    const result = await this.prisma.transactionHistory.count({
      where: {
        createdAt: {
          gte: params.startDate,
          lte: params.endDate,
        },
        ...(params.type && { type: params.type }),
        ...(params.status && { status: params.status }),
        userId: params.userId,
      },
    });

    return result;
  }

  async getCourseTransactions(params: {
    startDate: Date;
    endDate: Date;
    status: TransactionStatus;
    type: TransactionType;
    userId: string;
    courseId?: string;
  }): Promise<Array<{ courseId: string; amount: number; count: number }>> {
    const transactions = await this.prisma.transactionHistory.groupBy({
      by: ["courseId"],
      where: {
        createdAt: {
          gte: params.startDate,
          lte: params.endDate,
        },
        status: params.status,
        type: params.type,
        userId: params.userId,
        ...(params.courseId && { courseId: params.courseId }),
        courseId: {
          not: null,
        },
      },
      _sum: {
        amount: true,
      },
      _count: {
        _all: true,
      },
    });

    return transactions
      .filter((t) => t.courseId !== null)
      .map((t) => ({
        courseId: t.courseId as string,
        amount: t._sum.amount || 0,
        count: t._count._all,
      }));
  }

  async getCourseDetails(params: {
    courseIds: string[];
  }): Promise<
    Array<{
      id: string;
      title: string;
      thumbnail: string | null;
      adminSharePercentage: number;
      creator: {
        id: string;
        name: string;
        avatar: string | null;
      };
    }>
  > {
    const validCourseIds = params.courseIds.filter((id) => id != null);
    if (validCourseIds.length === 0) {
      return [];
    }

    const courses = await this.prisma.course.findMany({
      where: {
        id: {
          in: validCourseIds,
        },
      },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        adminSharePercentage: true,
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      thumbnail: course.thumbnail,
      adminSharePercentage: Number(course.adminSharePercentage),
      creator: {
        id: course.creator.id,
        name: course.creator.name,
        avatar: course.creator.avatar,
      },
    }));
  }

  async getTotalCourses(params: {
    startDate: Date;
    endDate: Date;
    userId: string;
    search?: string;
  }): Promise<number> {
    return this.prisma.course.count({
      where: {
        createdAt: {
          gte: params.startDate,
          lte: params.endDate,
        },
        createdBy: params.userId,
        ...(params.search && {
          OR: [
            { title: { contains: params.search, mode: "insensitive" } },
            { description: { contains: params.search, mode: "insensitive" } },
          ],
        }),
      },
    });
  }
}
