export interface GetLatestRevenueParams {
  startDate: Date;
  endDate: Date;
  userId: string;
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'latest' | 'oldest';
}

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
  customerName: string;
  customerEmail: string;
  transactionAmount: number;
}

export interface GetLatestRevenueResult {
  items: CourseRevenueItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 