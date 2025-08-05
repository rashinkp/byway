import { TransactionType } from "../../domain/enum/transaction-type.enum";
import { TransactionStatus } from "../../domain/enum/transaction-status.enum";

export interface IRevenueRepository {
  getTransactionAmounts(options: {
    startDate: Date;
    endDate: Date;
    type: TransactionType;
    status: TransactionStatus;
    userId: string;
  }): Promise<{ amount: number }>;

  getTransactionCounts(options: {
    startDate: Date;
    endDate: Date;
    type?: TransactionType;
    status?: TransactionStatus;
    userId: string;
  }): Promise<number>;

  getCourseTransactions(options: {
    startDate: Date;
    endDate: Date;
    type: TransactionType;
    status: TransactionStatus;
    userId?: string;
  }): Promise<Array<{
    courseId: string;
    amount: number;
    count: number;
  }>>;

  getCourseDetails(options: {
    courseIds: string[];
  }): Promise<Array<{
    id: string;
    title: string;
    thumbnail: string | null;
    creator: {
      id: string;
      name: string;
      avatar: string | null;
    };
    adminSharePercentage: number;
  }>>;

  getTotalCourses(options: {
    startDate: Date;
    endDate: Date;
    userId?: string;
    search?: string;
  }): Promise<number>;

  getLatestRevenue(options: {
    userId: string;
    page?: number;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{
    items: Array<{
      id: string;
      amount: number;
      type: string;
      status: string;
      createdAt: Date;
      course?: {
        id: string;
        title: string;
      };
    }>;
    total: number;
  }>;

  getTotalRevenue(userId: string): Promise<number>;
}
