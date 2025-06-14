import { TransactionType } from "../../domain/enum/transaction-type.enum";
import { TransactionStatus } from "../../domain/enum/transaction-status.enum";
import { RevenueMetrics, RevenueByCourse, RevenueByInstructor } from "../../domain/entities/revenue.entity";

export interface IRevenueRepository {
  getTransactionAmounts(params: {
    startDate: Date;
    endDate: Date;
    type: TransactionType;
    status: TransactionStatus;
  }): Promise<{ amount: number }>;

  getTransactionCounts(params: {
    startDate: Date;
    endDate: Date;
    type?: TransactionType;
    status?: TransactionStatus;
  }): Promise<number>;

  getCourseTransactions(params: {
    startDate: Date;
    endDate: Date;
    status: TransactionStatus;
    type: TransactionType;
  }): Promise<Array<{
    courseId: string;
    amount: number;
    count: number;
  }>>;

  getInstructorCourses(params: {
    courseIds: string[];
  }): Promise<Array<{
    courseId: string;
    instructorId: string;
    instructorName: string;
  }>>;

  getCourseDetails(params: {
    courseIds: string[];
  }): Promise<Array<{
    id: string;
    title: string;
  }>>;

  getRevenueMetrics(params: {
    startDate: Date;
    endDate: Date;
    adminSharePercentage: number;
  }): Promise<RevenueMetrics>;

  getRevenueByCourse(params: {
    startDate: Date;
    endDate: Date;
    adminSharePercentage: number;
  }): Promise<RevenueByCourse[]>;

  getRevenueByInstructor(params: {
    startDate: Date;
    endDate: Date;
    adminSharePercentage: number;
  }): Promise<RevenueByInstructor[]>;

  getTransactionStats(params: {
    startDate: Date;
    endDate: Date;
  }): Promise<{
    totalTransactions: number;
    successfulTransactions: number;
    failedTransactions: number;
    refundedTransactions: number;
    averageTransactionAmount: number;
  }>;
} 