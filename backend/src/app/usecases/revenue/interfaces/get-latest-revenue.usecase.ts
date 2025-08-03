import {
  GetLatestRevenueParams,
  GetLatestRevenueResult,
} from "../../../dtos/revenue/get-latest-revenue.dto";

export interface CourseRevenueItem {
  orderId: string;
  courseId: string;
  courseTitle: string;
  creatorName: string;
  coursePrice: number;
  offerPrice: number;
  adminSharePercentage: number;
  adminShare: number;
  netAmount: number;
  createdAt: Date;
}

export interface IGetLatestRevenueUseCase {
  execute(params: GetLatestRevenueParams): Promise<GetLatestRevenueResult>;
}
