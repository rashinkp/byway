"use client";

import { useAdminDashboard } from "@/hooks/admin/useAdminDashboard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { StatCard } from "@/components/dashboard/StatCard";
import { useRouter } from "next/navigation";
import {
	BookOpen,
	GraduationCap,
	Users,
	DollarSign,
	TrendingUp,
	AlertCircle,
	CheckCircle,
	UserCheck,
	UserX,
	BarChart3,
	MessageSquare,
} from "lucide-react";
import { useRef } from "react";
import PDFExportButton from "@/components/common/PDFExportButton";

// Function to truncate to 2 decimal places without rounding
const truncateToTwoDecimals = (num: number): string => {
	const str = num.toString();
	const decimalIndex = str.indexOf(".");
	if (decimalIndex === -1) {
		return str + ".00";
	}
	const truncated = str.substring(0, decimalIndex + 3); // Include 2 decimal places
	return truncated.padEnd(decimalIndex + 3, "0"); // Pad with zeros if needed
};



export default function AdminDashboard() {
	const { data, isLoading, error } = useAdminDashboard();
	const router = useRouter();
	const dashboardRef = useRef<HTMLDivElement>(null);

	const handleCourseClick = (courseId: string) => {
		router.push(`/admin/courses/${courseId}`);
	};

	return (
		<DashboardLayout
			title="Admin Dashboard"
			subtitle="Comprehensive overview of platform performance and analytics"
			isLoading={isLoading}
			error={error}
			data={data}
		>
			<div className="flex justify-end mb-3 sm:mb-4">
				<PDFExportButton dashboardData={data} />
			</div>
			{data && (
				<div ref={dashboardRef} className="space-y-6 sm:space-y-8">
					{/* Statistics Cards Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
						{/* Courses Stats */}
						<StatCard
							icon={BookOpen}
							iconColor="text-blue-600"
							title="Total Courses"
							value={data.stats.courseStats.totalCourses}
							badges={[
								{
									label: `${data.stats.courseStats.activeCourses} Active`,
									variant: "outline",
									icon: CheckCircle,
								},
								{
									label: `${data.stats.courseStats.pendingCourses} Pending`,
									variant: "secondary",
									icon: AlertCircle,
								},
							]}
						/>

						{/* Instructors Stats */}
						<StatCard
							icon={GraduationCap}
							iconColor="text-purple-600"
							title="Instructors"
							value={data.stats.userStats.totalInstructors}
							badges={[
								{
									label: `${data.stats.userStats.activeInstructors} Active`,
									variant: "outline",
									icon: CheckCircle,
								},
								{
									label: `${data.stats.userStats.inactiveInstructors} Inactive`,
									variant: "secondary",
									icon: UserX,
								},
							]}
						/>

						{/* Users Stats */}
						<StatCard
							icon={Users}
							iconColor="text-green-600"
							title="Total Users"
							value={data.stats.userStats.totalUsers}
							badges={[
								{
									label: `${data.stats.userStats.activeUsers} Active`,
									variant: "outline",
									icon: UserCheck,
								},
								{
									label: `${data.stats.userStats.inactiveUsers} Inactive`,
									variant: "secondary",
									icon: UserX,
								},
							]}
						/>

						{/* Revenue Stats */}
						<StatCard
							icon={DollarSign}
							iconColor="text-yellow-600"
							title="Total Revenue"
							value={`$${truncateToTwoDecimals(data.stats.totalRevenue)}`}
							badges={[
								{
									label: "Revenue",
									variant: "default",
									icon: TrendingUp,
								},
							]}
						/>
					</div>

					{/* Enrollments Stats */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
						<StatCard
							icon={Users}
							iconColor="text-indigo-600"
							title="Total Enrollments"
							value={data.stats.enrollmentStats.totalEnrollments}
						/>
					</div>

					{/* Top Enrolled Courses Section */}
					<DashboardSection
						icon={TrendingUp}
						iconColor="text-blue-600"
						iconBgColor="bg-blue-50"
						title="Top Enrolled Courses"
						subtitle="Most popular courses by enrollment count and revenue"
					>
						{data.topEnrolledCourses.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-16 px-8 text-center">
								<div className="mb-6">
									<BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-600" />
								</div>
								<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Courses Yet</h3>
								<p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mb-8 leading-relaxed">
									There are no courses with enrollments yet. Courses will appear here once students start enrolling.
								</p>
							</div>
						) : (
							<div className="space-y-4">
								{data.topEnrolledCourses.map((course, index) => (
									<div
										key={course.courseId}
										className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4 dark:bg-[#232323] dark:border-gray-700"
									>
										<div className="flex items-center space-x-4">
											<div className="w-10 h-10 rounded-lg flex items-center justify-center">
												<span className="text-sm font-semibold text-blue-600 dark:text-[#facc15]">
													#{index + 1}
												</span>
											</div>
											<div className="flex-1 space-y-2">
												<div className="flex flex-wrap items-center gap-2 min-w-0">
													<span className="text-sm font-medium text-gray-500">
														#{index + 1}
													</span>
													<button
														onClick={() => handleCourseClick(course.courseId)}
														className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 hover:underline transition-colors cursor-pointer flex-1 min-w-0 whitespace-normal break-words line-clamp-2"
													>
														{course.courseTitle}
													</button>
													<span className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 w-full sm:w-auto">
														by {course.instructorName}
													</span>
												</div>
												<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
													<div className="flex items-center space-x-2">
														<Users className="w-4 h-4 text-gray-400" />
														<div>
															<p className="text-xs text-gray-500 dark:text-gray-300">Enrollments</p>
															<p className="text-sm font-medium dark:text-white">
																{course.enrollmentCount}
															</p>
														</div>
													</div>
													<div className="flex items-center space-x-2">
														<DollarSign className="w-4 h-4 text-gray-400" />
														<div>
															<p className="text-xs text-gray-500 dark:text-gray-300">Revenue</p>
															<p className="text-sm font-medium dark:text-white">
																${truncateToTwoDecimals(course.revenue)}
															</p>
														</div>
													</div>
													<div className="flex items-center space-x-2">
														<BarChart3 className="w-4 h-4 text-gray-400" />
														<div>
															<p className="text-xs text-gray-500 dark:text-gray-300">Rating</p>
															<p className="text-sm font-medium dark:text-white">
																{course.rating}/5
															</p>
														</div>
													</div>
													<div className="flex items-center space-x-2">
														<MessageSquare className="w-4 h-4 text-gray-400" />
														<div>
															<p className="text-xs text-gray-500 dark:text-gray-300">Reviews</p>
															<p className="text-sm font-medium dark:text-white">
																{course.reviewCount}
															</p>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</DashboardSection>

					{/* Top Instructors Section */}
					<DashboardSection
						icon={GraduationCap}
						iconColor="text-purple-600"
						iconBgColor="bg-purple-50"
						title="Top Performing Instructors"
						subtitle="Instructors with highest selling rates and revenue"
					>
						{data.topInstructors.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-16 px-8 text-center">
								<div className="mb-6">
									<GraduationCap className="w-16 h-16 text-gray-400 dark:text-gray-600" />
								</div>
								<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Instructors Yet</h3>
								<p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mb-8 leading-relaxed">
									There are no instructors with performance data yet. Instructors will appear here once they start creating courses and generating revenue.
								</p>
							</div>
						) : (
							<div className="space-y-4">
								{data.topInstructors.map((instructor, index) => (
									<div
										key={instructor.instructorId}
										className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4 dark:bg-[#232323] dark:border-gray-700"
									>
										<div className="flex items-center space-x-4">
											<div className="w-10 h-10 rounded-lg flex items-center justify-center">
												<span className="text-sm font-semibold text-purple-600 dark:text-[#facc15]">
													#{index + 1}
												</span>
											</div>
											<div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center dark:bg-[#18181b]">
												<span className="text-sm font-semibold text-gray-600 dark:text-[#facc15]">
													{instructor.instructorName
														.split(" ")
														.map((n) => n[0])
														.join("")}
												</span>
											</div>
											<div className="flex-1 space-y-2">
												<div className="flex flex-wrap items-center gap-2">
													<span className="text-sm font-medium text-gray-500">
														#{index + 1}
													</span>
													<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
														{instructor.instructorName}
													</h3>
													<span className="text-sm text-gray-500 dark:text-gray-300">
														{instructor.email}
													</span>
													<span
														className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-1 sm:mt-0 sm:ml-auto ${
															instructor.isActive
																? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700"
																: "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700"
														}`}
													>
														{instructor.isActive ? "Active" : "Inactive"}
													</span>
												</div>
												<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
													<div className="flex items-center space-x-2">
														<BookOpen className="w-4 h-4 text-gray-400" />
														<div>
															<p className="text-xs text-gray-500 dark:text-gray-300">Courses</p>
															<p className="text-sm font-medium dark:text-white">
																{instructor.courseCount}
															</p>
														</div>
													</div>
													<div className="flex items-center space-x-2">
														<Users className="w-4 h-4 text-gray-400" />
														<div>
															<p className="text-xs text-gray-500 dark:text-gray-300">Enrollments</p>
															<p className="text-sm font-medium dark:text-white">
																{instructor.totalEnrollments}
															</p>
														</div>
													</div>
													<div className="flex items-center space-x-2">
														<DollarSign className="w-4 h-4 text-gray-400" />
														<div>
															<p className="text-xs text-gray-500 dark:text-gray-300">Revenue</p>
															<p className="text-sm font-medium dark:text-white">
																${truncateToTwoDecimals(instructor.totalRevenue)}
															</p>
														</div>
													</div>
													<div className="flex items-center space-x-2">
														<BarChart3 className="w-4 h-4 text-gray-400" />
														<div>
															<p className="text-xs text-gray-500 dark:text-gray-300">Rating</p>
															<p className="text-sm font-medium dark:text-white">
																{truncateToTwoDecimals(instructor.averageRating)}/5
															</p>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</DashboardSection>
				</div>
			)}
		</DashboardLayout>
	);
}
