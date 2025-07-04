export interface RevenueMetrics {
	totalRevenue: number;
	adminShare: number;
	netRevenue: number;
	refundedAmount: number;
	netRevenueAfterRefunds: number;
	period: {
		start: Date;
		end: Date;
	};
}

export interface RevenueByCourse {
	courseId: string;
	courseTitle: string;
	totalRevenue: number;
	adminShare: number;
	netRevenue: number;
	enrollmentCount: number;
}

export interface RevenueByInstructor {
	instructorId: string;
	instructorName: string;
	totalRevenue: number;
	adminShare: number;
	netRevenue: number;
	courseCount: number;
}

export interface TransactionStats {
	totalTransactions: number;
	successfulTransactions: number;
	failedTransactions: number;
	refundedTransactions: number;
	averageTransactionAmount: number;
}

export interface RevenueAnalytics {
	metrics: RevenueMetrics;
	courseRevenues: RevenueByCourse[];
	instructorRevenues: RevenueByInstructor[];
	transactionStats: TransactionStats;
}

export interface GetRevenueAnalyticsParams {
	startDate: string;
	endDate: string;
}

export interface GetOverallRevenueParams {
	startDate: string;
	endDate: string;
}

export interface GetCourseRevenueParams extends GetOverallRevenueParams {
	sortBy?: "revenue" | "enrollments" | "name";
	sortOrder?: "asc" | "desc";
	search?: string;
	page?: number;
	limit?: number;
}

export interface GetLatestRevenueParams extends GetOverallRevenueParams {
	page?: number;
	limit?: number;
	search?: string;
	sortBy?: "latest" | "oldest";
}

export interface OverallRevenue {
	totalRevenue: number;
	refundedAmount: number;
	netRevenue: number;
	period: {
		start: string;
		end: string;
	};
}

export interface CourseRevenue {
	courses: Array<{
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
	}>;
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface OverallRevenueResponse {
	success: boolean;
	message: string;
	data: {
		totalRevenue: number;
		refundedAmount: number;
		netRevenue: number;
		coursesSold: number;
		period: {
			start: string;
			end: string;
		};
	};
}

export interface CourseRevenueResponse {
	success: boolean;
	message: string;
	data: {
		courses: Array<{
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
		}>;
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

export interface LatestRevenueItem {
	orderId: string;
	courseId: string;
	courseTitle: string;
	creatorName: string;
	coursePrice: number;
	offerPrice: number;
	adminSharePercentage: number;
	adminShare: number;
	netAmount: number;
	createdAt: string;
	customerName: string;
	customerEmail: string;
	transactionAmount: number;
}

export interface LatestRevenueResponse {
	success: boolean;
	message: string;
	data: {
		items: LatestRevenueItem[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}
