export interface ITopEnrolledCourse {
  courseId: string;
  courseTitle: string;
  instructorName: string;
  enrollmentCount: number;
  revenue: number;
  rating: number;
  reviewCount: number;
}

export interface IGetTopEnrolledCoursesInput {
  userId: string;
  limit?: number;
  role?: "ADMIN" | "INSTRUCTOR";
}

export interface IGetTopEnrolledCoursesUseCase {
  execute(input: IGetTopEnrolledCoursesInput): Promise<ITopEnrolledCourse[]>;
} 