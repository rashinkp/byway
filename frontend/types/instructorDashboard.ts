// Instructor Dashboard Types
export interface InstructorDashboardStats {
	totalCourses: number;
	totalStudents: number;
	totalEnrollments: number;
	totalRevenue: number;
	activeCourses: number;
	pendingCourses: number;
	completedCourses: number;
	averageRating: number;
	totalReviews: number;
}

export interface InstructorCourseStats {
	courseId: string;
	courseTitle: string;
	enrollmentCount: number;
	revenue: number;
	rating: number;
	reviewCount: number;
	status: string;
	createdAt: string;
	lastEnrollmentDate?: string;
}

export interface InstructorStudentStats {
	studentId: string;
	studentName: string;
	email: string;
	enrolledCourses: number;
	lastEnrollmentDate: string;
	isActive: boolean;
}

export interface RecentEnrollment {
	courseId: string;
	courseTitle: string;
	studentName: string;
	enrolledAt: string;
}

export interface InstructorDashboardResponse {
	stats: InstructorDashboardStats;
	topCourses: InstructorCourseStats[];
	recentStudents: InstructorStudentStats[];
	recentEnrollments: RecentEnrollment[];
}

export interface ApiResponse<T> {
	success: boolean;
	message: string;
	data: T;
}
