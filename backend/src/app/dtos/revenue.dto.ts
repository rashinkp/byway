export interface GetLatestRevenueParamsDTO {
  startDate?: Date;
  endDate?: Date;
  userId: string;
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'latest' | 'oldest';
}

export interface CourseRevenueItemDTO {
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

export interface GetLatestRevenueResultDTO {
  items: CourseRevenueItemDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 




export interface GetCourseRevenueParamsDTO {
  startDate: Date;
  endDate: Date;
  userId: string;
  sortBy?: "revenue" | "enrollments" | "name";
  sortOrder?: "asc" | "desc";
  search?: string;
  page?: number;
  limit?: number;
}

export interface CourseRevenueDTO {
  courseId: string;
  title: string;
  thumbnail: string | null;
  creator: {
    id: string;
    name: string;
    avatar: string | null;
  };
  totalRevenue: number;
  enrollments: number;
  adminShare: number;
  netRevenue: number;
}

export interface GetCourseRevenueResultDTO {
  courses: CourseRevenueDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}