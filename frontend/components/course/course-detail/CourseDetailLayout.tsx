import React, { ReactNode } from "react";
import { Course } from "@/types/course";
import { User, PublicUser } from "@/types/user";
import { ILesson, PublicLesson } from "@/types/lesson";
import { useAuthStore } from "@/stores/auth.store";
import CourseReviews from "@/components/review/CourseReviews";
import ErrorDisplay from "@/components/ErrorDisplay";

interface CourseDetailLayoutProps {
	course: Course | undefined;
	instructor: (User | PublicUser) | undefined;
	lessons: (ILesson | PublicLesson)[] | undefined;
	isLoading: {
		course: boolean;
		instructor: boolean;
		lessons: boolean;
		user: boolean;
	};
	error: any;
	sidebarProps: {
		isCartLoading?: boolean;
		handleAddToCart?: () => void;
		isEnrolled?: boolean;
		userLoading?: boolean;
		adminActions?: ReactNode;
		instructorActions?: ReactNode;
	};
	tabContent?: {
		[key: string]: ReactNode;
	};
	showReviews?: boolean;
	customTabs?: Array<{
		id: string;
		label: string;
		icon: React.ReactNode;
	}>;
}

export default function CourseDetailLayout({
	course,
	instructor,
	lessons,
	isLoading,
	error,
	sidebarProps,
	tabContent,
	showReviews = true,
	customTabs = [],
}: CourseDetailLayoutProps) {
	const { user } = useAuthStore();
	const userRole = user?.role || "USER";

	if (error) {
		return (
			<ErrorDisplay
				error={error}
				title="Course Error"
				description="Error occurred while loading the course."
			/>
		);
	}

	return (
		<div className="min-h-screen p-4 sm:p-8 bg-white dark:bg-[#18181b] flex justify-center">
			<div className="w-full max-w-5xl p-6 space-y-8">
				{/* Header: Thumbnail, Title, Meta, Price, Purchase/Enroll */}
				<div className="flex flex-col sm:flex-row gap-6 items-center">
					<div className="w-40 h-40 rounded-xl overflow-hidden flex-shrink-0 bg-[#f9fafb] dark:bg-[#18181b] border border-[#facc15]">
						<img src={course?.thumbnail || '/placeholder-course.jpg'} alt={course?.title || 'Course Thumbnail'} className="object-cover w-full h-full" />
					</div>
					<div className="flex-1 space-y-2 text-center sm:text-left">
						<h1 className="text-3xl font-bold text-black dark:text-[#facc15]">{course?.title}</h1>
						<div className="flex flex-wrap gap-2 justify-center sm:justify-start items-center">
							<span className="text-sm px-3 py-1 rounded-full bg-[#facc15]/10 text-[#facc15] font-medium">{course?.level || 'All Levels'}</span>
							{course?.duration && <span className="text-sm px-3 py-1 rounded-full bg-[#facc15]/10 text-[#facc15] font-medium">{course.duration} min</span>}
							<span className="text-sm px-3 py-1 rounded-full bg-[#facc15]/10 text-[#facc15] font-medium">{lessons?.length || 0} Lessons</span>
						</div>
						{/* Review Stats */}
						{course?.reviewStats?.totalReviews && course?.reviewStats?.totalReviews > 0 && (
							<div className="flex flex-wrap gap-2 items-center justify-center sm:justify-start mt-2">
								<span className="flex items-center gap-1">
									<span className="text-lg font-bold text-[#facc15]">{course?.reviewStats?.averageRating?.toFixed(1)}</span>
									<span className="flex gap-0.5">
										{Array.from({ length: 5 }, (_, i) => (
											<svg key={i} className={`w-4 h-4 ${i < Math.round(course?.reviewStats?.averageRating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><polygon points="9.9,1.1 7.6,6.6 1.6,7.6 6,11.9 4.9,17.9 9.9,14.9 14.9,17.9 13.8,11.9 18.2,7.6 12.2,6.6 "/></svg>
										))}
									</span>
									<span className="text-sm text-gray-500 dark:text-gray-300 ml-1">({course?.reviewStats?.totalReviews})</span>
								</span>
							</div>
						)}
						<div className="flex flex-wrap gap-3 items-center justify-center sm:justify-start mt-2">
							{course?.price && (
								<span className="text-2xl font-bold text-[#facc15]">₹{Number(course?.offer || course?.price).toFixed(2)}</span>
							)}
							{course?.offer && course?.offer !== course?.price && (
								<span className="text-lg text-gray-500 dark:text-gray-300 line-through">₹{Number(course?.price).toFixed(2)}</span>
							)}
							{/* Purchase/Enroll Buttons */}
							{sidebarProps && (
								<>
									{sidebarProps.isEnrolled ? (
										<button className="px-6 py-2 rounded-full bg-green-100 text-green-700 font-semibold shadow border-none" onClick={() => window.location.href = `/user/my-courses/${course?.id}`}>Learn Now</button>
									) : course?.isInCart ? (
										<>
											<button className="px-6 py-2 rounded-full bg-[#facc15] text-black font-semibold shadow hover:bg-[#18181b] hover:text-[#facc15] transition-colors border-none" onClick={() => window.location.href = '/user/cart'}>Go to Cart</button>
											<button className="px-6 py-2 rounded-full bg-[#18181b] text-[#facc15] font-semibold shadow hover:bg-[#facc15] hover:text-black transition-colors border-none ml-2" onClick={() => window.location.href = `/user/checkout?courseId=${course?.id}`}>Buy Now</button>
										</>
									) : (
										<>
											<button
												onClick={sidebarProps.handleAddToCart}
												disabled={sidebarProps.isCartLoading}
												className="px-6 py-2 rounded-full bg-[#facc15] text-black font-semibold shadow hover:bg-[#18181b] hover:text-[#facc15] transition-colors border-none disabled:opacity-60"
											>
												{sidebarProps.isCartLoading ? 'Processing...' : 'Add to Cart'}
											</button>
											<button className="px-6 py-2 rounded-full bg-[#18181b] text-[#facc15] font-semibold shadow hover:bg-[#facc15] hover:text-black transition-colors border-none ml-2" onClick={() => window.location.href = `/user/checkout?courseId=${course?.id}`}>Buy Now</button>
										</>
									)}
								</>
							)}
						</div>
						<div className="mt-2 text-gray-500 dark:text-gray-300 text-base">{course?.description}</div>
					</div>
				</div>

				{/* Instructor */}
				<div className="flex items-center gap-4">
					<div className="w-14 h-14 rounded-full overflow-hidden bg-[#f9fafb] dark:bg-[#18181b] border border-[#facc15]">
						{instructor && (instructor as any).avatar ? (
							<img src={(instructor as any).avatar} alt={instructor.name} className="w-full h-full object-cover" />
						) : (
							<div className="w-full h-full flex items-center justify-center text-[#facc15] text-xl font-bold">
								{instructor?.name?.charAt(0) || 'I'}
							</div>
						)}
					</div>
					<div>
						<div className="text-lg font-semibold text-black dark:text-[#facc15]">{instructor?.name || 'Anonymous'}</div>
						<div className="text-sm text-gray-500 dark:text-gray-300">{instructor?.bio || 'No bio available.'}</div>
						{instructor && (instructor as any).longBio && (
							<div className="text-gray-500 dark:text-gray-300 text-sm mt-1">{(instructor as any).longBio}</div>
						)}
					</div>
				</div>

				{/* About/Long Description */}
				{(course?.details?.longDescription || course?.description) && (
					<div>
						<h2 className="text-xl font-bold text-black dark:text-[#facc15] mb-2">About this course</h2>
						<p className="text-gray-500 dark:text-gray-300 text-base leading-relaxed">{course.details?.longDescription || course.description}</p>
					</div>
				)}

				{/* Syllabus */}
				<div>
					<h2 className="text-xl font-bold text-black dark:text-[#facc15] mb-2">Syllabus</h2>
					{isLoading.lessons ? (
						<div className="text-gray-500 dark:text-gray-300">Loading lessons...</div>
					) : lessons && lessons.length > 0 ? (
						<ul className="space-y-3">
							{lessons.map((lesson, idx) => (
								<li key={lesson.id} className="flex items-start gap-3">
									<span className="text-[#facc15] font-bold">{idx + 1}.</span>
									<div>
										<h3 className="font-semibold text-black dark:text-[#facc15]">{lesson.title}</h3>
										<p className="text-gray-500 dark:text-gray-300 text-sm">{lesson.description}</p>
									</div>
								</li>
							))}
						</ul>
					) : (
						<div className="text-gray-500 dark:text-gray-300">No lessons available.</div>
					)}
				</div>

				{/* Course Features */}
				<div>
					<h2 className="text-xl font-bold text-black dark:text-[#facc15] mb-2">This course includes:</h2>
					<ul className="space-y-3">
						<li className="flex items-center text-gray-500 dark:text-gray-300"><svg className="w-4 h-4 mr-2 text-[#facc15]" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" /></svg>Full lifetime access</li>
						<li className="flex items-center text-gray-500 dark:text-gray-300"><svg className="w-4 h-4 mr-2 text-[#facc15]" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" /></svg>All course materials</li>
						<li className="flex items-center text-gray-500 dark:text-gray-300"><svg className="w-4 h-4 mr-2 text-[#facc15]" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" /></svg>Certificate of completion</li>
						<li className="flex items-center text-gray-500 dark:text-gray-300"><svg className="w-4 h-4 mr-2 text-[#facc15]" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" /></svg>Downloadable resources</li>
					</ul>
				</div>

				{/* Course Details */}
				<div>
					<h2 className="text-xl font-bold text-black dark:text-[#facc15] mb-2">Course Details</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<h4 className="font-semibold text-black dark:text-[#facc15] mb-1">Prerequisites</h4>
							<p className="text-gray-500 dark:text-gray-300">{course?.details?.prerequisites || 'No prerequisites specified.'}</p>
						</div>
						<div>
							<h4 className="font-semibold text-black dark:text-[#facc15] mb-1">Learning Objectives</h4>
							<p className="text-gray-500 dark:text-gray-300">{course?.details?.objectives || 'No learning objectives specified.'}</p>
						</div>
						<div>
							<h4 className="font-semibold text-black dark:text-[#facc15] mb-1">Target Audience</h4>
							<p className="text-gray-500 dark:text-gray-300">{course?.details?.targetAudience || 'No target audience specified.'}</p>
						</div>
						<div>
							<h4 className="font-semibold text-black dark:text-[#facc15] mb-1">Status</h4>
							<p className="text-gray-500 dark:text-gray-300">{course?.deletedAt ? 'Inactive' : 'Active'}</p>
						</div>
					</div>
				</div>

				{/* Reviews */}
				{showReviews && (
					<div>
						<h2 className="text-xl font-bold text-black dark:text-[#facc15] mb-2">Reviews</h2>
						<div className=" rounded-xl ">
							<CourseReviews course={course} isLoading={isLoading.course} userRole={userRole} />
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
