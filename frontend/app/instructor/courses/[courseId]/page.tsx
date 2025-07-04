"use client";

import { useParams } from "next/navigation";
import { LessonManager } from "@/components/lesson/LessonManager";
import { useGetCourseById } from "@/hooks/course/useGetCourseById";
import PlaceHolderImage from "@/public/placeHolder.jpg";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
	Users,
	TrendingUp,
	BookOpen,
	StarIcon,
	InfoIcon,
	DollarSign,
	Percent,
} from "lucide-react";
import ErrorDisplay from "@/components/ErrorDisplay";
import { CourseDetails } from "@/components/course/CourseDetails";
import { AdditionalDetailsSection } from "@/components/course/CourseAdditionalDetails";
import CourseReviews from "@/components/review/CourseReviews";

export default function CourseDetailPage() {
	const { courseId } = useParams();
	const {
		data: course,
		isLoading,
		error,
		refetch,
	} = useGetCourseById(courseId as string);

	if (error) {
		return (
			<ErrorDisplay
				title="Course Error"
				description="Course error occurred. Please try again"
				error={error}
				onRetry={() => refetch()}
			/>
		);
	}

	const tabItems = [
		{ id: "overview", label: "Overview", icon: InfoIcon },
		{ id: "lessons", label: "Lessons", icon: BookOpen },
		{ id: "reviews", label: "Reviews", icon: StarIcon },
		{ id: "details", label: "Details", icon: InfoIcon },
	];

	return (
		<div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
			{/* Course Stats Section */}
			<div className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6 mb-6">
				<h3 className="text-sm font-semibold text-gray-900 mb-4">
					Course Performance
				</h3>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-blue-50">
							<Percent className="h-4 w-4 text-blue-600" />
						</div>
						<div>
							<p className="text-sm font-medium text-gray-900">
								{course?.instructorSharePercentage || 0}%
							</p>
							<p className="text-xs text-gray-500">Your Share</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-orange-50">
							<Users className="h-4 w-4 text-orange-600" />
						</div>
						<div>
							<p className="text-sm font-medium text-gray-900">
								{course?.adminSharePercentage || 0}%
							</p>
							<p className="text-xs text-gray-500">Admin Share</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-green-50">
							<DollarSign className="h-4 w-4 text-green-600" />
						</div>
						<div>
							<p className="text-sm font-medium text-gray-900">
								${Number(course?.price)?.toFixed(2) || "0.00"}
							</p>
							<p className="text-xs text-gray-500">Course Price</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-purple-50">
							<TrendingUp className="h-4 w-4 text-purple-600" />
						</div>
						<div>
							<p className="text-sm font-medium text-gray-900">
								${Number(course?.offer)?.toFixed(2) || "0.00"}
							</p>
							<p className="text-xs text-gray-500">Offer Price</p>
						</div>
					</div>
				</div>
			</div>

			<Tabs defaultValue="overview" className="w-full">
				<div className="relative mb-6">
					<TabsList className="flex justify-center md:justify-start gap-1 p-1 bg-gray-100 rounded-xl overflow-x-auto no-scrollbar">
						{tabItems.map((tab) => (
							<TabsTrigger
								key={tab.id}
								value={tab.id}
								className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 rounded-lg transition-all 
                data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm
                hover:bg-gray-200 hover:text-primary"
							>
								<tab.icon className="h-4 w-4" />
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>
				</div>

				<TabsContent value="overview" className="mt-0">
					<CourseDetails
						course={course}
						isLoading={isLoading}
						src={course?.thumbnail || PlaceHolderImage}
						alt={course?.title || "Course Thumbnail"}
					/>
				</TabsContent>
				<TabsContent value="lessons" className="mt-0">
					<LessonManager courseId={courseId as string} />
				</TabsContent>
				<TabsContent value="reviews" className="mt-0">
					<div className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6">
						<CourseReviews
							course={course}
							isLoading={isLoading}
							userRole="INSTRUCTOR"
						/>
					</div>
				</TabsContent>
				<TabsContent value="details" className="mt-0">
					<AdditionalDetailsSection course={course} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
