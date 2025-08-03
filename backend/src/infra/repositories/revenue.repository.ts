import { PrismaClient } from "@prisma/client";
import { TransactionType } from "../../domain/enum/transaction-type.enum";
import { TransactionStatus } from "../../domain/enum/transaction-status.enum";
import { IRevenueRepository } from "@/app/repositories/revenue.repository";
import {
  GetLatestRevenueParams,
  GetLatestRevenueResult,
} from "@/app/dtos/revenue/get-latest-revenue.dto";

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

  async getCourseDetails(params: { courseIds: string[] }): Promise<
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

  async getTotalRevenue(userId: string): Promise<number> {
    const result = await this.prisma.transactionHistory.aggregate({
      where: {
        userId,
        type: "REVENUE",
        status: "COMPLETED",
      },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount || 0;
  }

  async getLatestRevenue(params: GetLatestRevenueParams): Promise<{
    items: GetLatestRevenueResult["items"];
    total: number;
  }> {
    const {
      startDate,
      endDate,
      userId,
      page = 1,
      limit = 10,
      search,
      sortBy = "latest",
    } = params;
    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {
      userId,
      type: "REVENUE",
      status: "COMPLETED",
    };

    // Add date range only if provided
    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    // Add search functionality
    if (search) {
      whereClause.OR = [
        {
          order: {
            items: {
              some: {
                course: {
                  title: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        },
        {
          order: {
            items: {
              some: {
                course: {
                  creator: {
                    name: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
          },
        },
        {
          order: {
            user: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
      ];
    }

    // Get transactions with type REVENUE and status COMPLETED
    const transactions = await this.prisma.transactionHistory.findMany({
      where: whereClause,
      include: {
        order: {
          include: {
            items: {
              include: {
                course: {
                  include: {
                    creator: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: sortBy === "latest" ? "desc" : "asc",
      },
      skip,
      take: limit,
    });

    // Get total count for pagination
    const total = await this.prisma.transactionHistory.count({
      where: whereClause,
    });

    // Transform the data
    const items = transactions.flatMap(
      (transaction) =>
        transaction.order?.items.map((item) => ({
          orderId: transaction.orderId || "",
          courseId: item.courseId,
          courseTitle: item.course.title,
          creatorName: item.course.creator.name,
          coursePrice: Number(item.coursePrice),
          offerPrice: Number(item.coursePrice) - (Number(item.discount) || 0),
          adminSharePercentage: Number(item.adminSharePercentage),
          adminShare:
            (Number(item.coursePrice) * Number(item.adminSharePercentage)) /
            100,
          netAmount:
            Number(item.coursePrice) -
            (Number(item.coursePrice) * Number(item.adminSharePercentage)) /
              100,
          createdAt: transaction.createdAt,
          customerName: transaction.order?.user?.name || "Unknown Customer",
          customerEmail: transaction.order?.user?.email || "",
          transactionAmount: Number(transaction.amount),
        })) || []
    );

    return {
      items,
      total,
    };
  }
}
