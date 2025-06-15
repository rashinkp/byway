import { TransactionType } from "../../domain/enum/transaction-type.enum";
import { TransactionStatus } from "../../domain/enum/transaction-status.enum";

export interface IRevenueRepository {
  getTransactionAmounts(params: {
    startDate: Date;
    endDate: Date;
    type: TransactionType;
    status: TransactionStatus;
    userId: string;
  }): Promise<{ amount: number }>;

  getTransactionCounts(params: {
    startDate: Date;
    endDate: Date;
    type?: TransactionType;
    status?: TransactionStatus;
    userId: string;
  }): Promise<number>;

  getCourseTransactions(params: {
    startDate: Date;
    endDate: Date;
    status: TransactionStatus;
    type: TransactionType;
    userId: string;
    courseId?: string;
  }): Promise<Array<{
    courseId: string;
    amount: number;
    count: number;
  }>>;

  getCourseDetails(params: {
    courseIds: string[];
  }): Promise<Array<{
    id: string;
    title: string;
    thumbnail: string | null;
    adminSharePercentage: number;
    creator: {
      id: string;
      name: string;
      avatar: string | null;
    };
  }>>;

  getTotalCourses(params: {
    startDate: Date;
    endDate: Date;
    userId: string;
    search?: string;
  }): Promise<number>;
} 