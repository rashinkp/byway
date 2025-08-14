export interface CourseRevenue {
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

export interface LatestRevenue {
  items: CourseRevenue[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


