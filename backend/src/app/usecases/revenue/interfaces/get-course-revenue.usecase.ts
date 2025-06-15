export interface GetCourseRevenueParams {
  startDate: Date;
  endDate: Date;
  userId: string;
  sortBy?: 'revenue' | 'enrollments' | 'name';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  page?: number;
  limit?: number;
}

export interface CourseRevenue {
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

export interface GetCourseRevenueResult {
  courses: CourseRevenue[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IGetCourseRevenueUseCase {
  execute(params: GetCourseRevenueParams): Promise<GetCourseRevenueResult>;
} 