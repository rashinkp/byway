import React from "react";
import { CourseDetailLayoutProps } from "@/types/course";
import { useAuthStore } from "@/stores/auth.store";
import CourseReviews from "@/components/review/CourseReviews";
import ErrorDisplay from "@/components/ErrorDisplay";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import CourseDetailLayoutSkeleton from "./CourseDetailLayoutSkeleton";
import AdminActions from "./AdminActions";
import { AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGetContentByLessonId } from "@/hooks/content/useGetContentByLessonId";
import { Skeleton } from "@/components/ui/skeleton";
import { useSignedUrl } from "@/hooks/file/useSignedUrl";
import { useEffect, useState } from "react";


export default function CourseDetailLayout({
	course,
	instructor,
	lessons,
	isLoading,
	error,
	sidebarProps,
	showReviews = true,
}: CourseDetailLayoutProps) {
	const { user } = useAuthStore();
	const userRole = user?.role || "USER";
	const [openLessonContentId, setOpenLessonContentId] = React.useState<string | null>(null);
	const isAdmin = userRole === 'ADMIN';
	const { data: lessonContent, isLoading: isContentLoading, error: contentError } = useGetContentByLessonId(openLessonContentId || "");

	// Resolve signed URLs for lesson content (video/document) when fileUrl/thumbnailUrl are S3 keys
	const lessonFileIsKey = typeof lessonContent?.fileUrl === 'string' && !!lessonContent?.fileUrl && !/^https?:\/\//.test(lessonContent.fileUrl) && !lessonContent.fileUrl.startsWith('/');
	const { url: lessonFileUrl } = useSignedUrl(lessonFileIsKey ? (lessonContent?.fileUrl as string) : null);
	const lessonThumbIsKey = typeof lessonContent?.thumbnailUrl === 'string' && !!lessonContent?.thumbnailUrl && !/^https?:\/\//.test(lessonContent.thumbnailUrl) && !lessonContent.thumbnailUrl.startsWith('/');
	const { url: lessonThumbUrl } = useSignedUrl(lessonThumbIsKey ? (lessonContent?.thumbnailUrl as string) : null);

	const resolvedVideoUrl = lessonContent?.fileUrl
		? (lessonFileIsKey ? lessonFileUrl : lessonContent.fileUrl)
		: undefined;
	const resolvedPosterUrl = lessonContent?.thumbnailUrl
		? (lessonThumbIsKey ? lessonThumbUrl : lessonContent.thumbnailUrl)
		: undefined;
	const resolvedDocUrl = lessonContent?.fileUrl
		? (lessonFileIsKey ? lessonFileUrl : lessonContent.fileUrl)
		: undefined;
	const isPdfDoc = typeof resolvedDocUrl === 'string'
		? resolvedDocUrl.split('?')[0].toLowerCase().endsWith('.pdf')
		: false;

	// Media loading state management
	const [videoLoading, setVideoLoading] = useState(true);
	const [docLoading, setDocLoading] = useState(true);

	useEffect(() => {
		// Reset loading when a different lesson is opened
		setVideoLoading(true);
		setDocLoading(true);
	}, [openLessonContentId]);

	useEffect(() => {
		// When the resolved URLs change, assume loading until media reports ready
		setVideoLoading(true);
	}, [resolvedVideoUrl]);

	useEffect(() => {
		setDocLoading(true);
	}, [resolvedDocUrl]);

	// Resolve signed URLs for course thumbnail and instructor avatar when they are S3 keys
	const courseThumbIsKey = typeof course?.thumbnail === 'string' && !!course?.thumbnail && !/^https?:\/\//.test(course.thumbnail) && !course.thumbnail.startsWith('/');
	const { url: courseThumbUrl } = useSignedUrl(courseThumbIsKey ? course?.thumbnail : null);
	const instructorAvatar = (instructor as { avatar?: string })?.avatar;
	const avatarIsKey = typeof instructorAvatar === 'string' && !!instructorAvatar && !/^https?:\/\//.test(instructorAvatar) && !instructorAvatar.startsWith('/');
	const { url: instructorAvatarUrl } = useSignedUrl(avatarIsKey ? instructorAvatar : null);

	// Default no-op functions for AdminActions
	const noOp: () => void = () => {};

	if (error) {
		return (
			<ErrorDisplay
				error={error}
				title="Course Error"
				description="Error occurred while loading the course."
			/>
		);
	}

	if (isLoading.course || isLoading.instructor || isLoading.lessons) {
		return <CourseDetailLayoutSkeleton />;
	}

	return (
		<div className="min-h-screen p-4 sm:p-8 bg-white dark:bg-[#18181b] flex justify-center">
			<div className="w-full max-w-5xl p-6 space-y-8">
				{/* Header: Thumbnail, Title, Meta, Price, Purchase/Enroll */}
				<div className="flex flex-col sm:flex-row gap-6 items-center">
					<div className="w-40 h-40 rounded-xl overflow-hidden flex-shrink-0 bg-[#f9fafb] dark:bg-[#18181b] border border-gray-200">
						<Image
							src={courseThumbIsKey ? (courseThumbUrl || '/placeholder-course.jpg') : (course?.thumbnail || '/placeholder-course.jpg')}
							alt={course?.title || 'Course Thumbnail'}
							width={160}
							height={160}
							className="object-cover w-full h-full"
							style={{ width: '100%', height: '100%' }}
						/>
					</div>
					<div className="flex-1 space-y-2 text-center sm:text-left">
						<h1 className="text-3xl font-bold text-black dark:text-white">{course?.title}</h1>
						<div className="flex flex-wrap gap-2 justify-center sm:justify-start items-center">
							<span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">{course?.level || 'All Levels'}</span>
							{course?.duration && <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">{course.duration} min</span>}
							<span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">{lessons?.length || 0} Lessons</span>
						</div>
						{/* Review Stats */}
						{course?.reviewStats?.totalReviews && course?.reviewStats?.totalReviews > 0 && (
							<div className="flex flex-wrap gap-2 items-center justify-center sm:justify-start mt-2">
								<span className="flex items-center gap-1">
									<span className="text-lg font-bold ">{course?.reviewStats?.averageRating?.toFixed(1)}</span>
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
							{userRole !== 'ADMIN' && course?.price && (
								<span className="text-2xl font-bold text-[#facc15]">${Number(course?.offer ?? course?.price).toFixed(2)}</span>
							)}
							{userRole !== 'ADMIN' && course?.offer && course?.offer !== course?.price && (
								<span className="text-lg text-gray-500 dark:text-gray-300 line-through">${Number(course?.price ?? 0).toFixed(2)}</span>
							)}
							{/* Purchase/Enroll Buttons or Admin Actions */}
							{sidebarProps && (
								<>
									{userRole === 'ADMIN' ? (
										sidebarProps.adminActions ? (
											sidebarProps.adminActions
										) : (
											<AdminActions 
												course={course} 
												isApproving={Boolean(sidebarProps.adminActionsProps?.isApproving)}
												isDeclining={Boolean(sidebarProps.adminActionsProps?.isDeclining)}
												isTogglingStatus={Boolean(sidebarProps.adminActionsProps?.isTogglingStatus)}
												onApprove={(sidebarProps.adminActionsProps?.onApprove || noOp) as () => void}
												onDecline={(sidebarProps.adminActionsProps?.onDecline || noOp) as () => void}
												onToggleStatus={(sidebarProps.adminActionsProps?.onToggleStatus || noOp) as () => void}	
											/>
										)
									) : sidebarProps.isEnrolled ? (
										<Button variant={'primary'} className="px-6 py-2" onClick={() => window.location.href = `/user/my-courses/${course?.id}`}>Learn Now</Button>
									) : course?.isInCart ? (
										<>
											<Button variant={'primary'} onClick={() => window.location.href = '/user/cart'}>Go to Cart</Button>
											<Button variant={'default'}  onClick={() => window.location.href = `/user/checkout?courseId=${course?.id}`}>Buy Now</Button>
										</>
									) : (
										<>
											<Button
												variant={'primary'}
												onClick={sidebarProps.handleAddToCart}
												disabled={sidebarProps.isCartLoading}
												
											>
												{sidebarProps.isCartLoading ? 'Processing...' : 'Add to Cart'}
											</Button>
											<Button  onClick={() => window.location.href = `/user/checkout?courseId=${course?.id}`}>Buy Now</Button>
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
					<div className="w-14 h-14 rounded-full overflow-hidden bg-[#f9fafb] dark:bg-[#18181b] border border-gray-200">
						{instructor && (instructor as { avatar?: string }).avatar ? (
							<Image
								src={avatarIsKey ? (instructorAvatarUrl || '/UserProfile.jpg') : ((instructor as { avatar?: string }).avatar || '/UserProfile.jpg')}
								alt={instructor.name}
								width={56}
								height={56}
								className="w-full h-full object-cover"
								style={{ width: '100%', height: '100%' }}
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center text-gray-700 text-xl font-bold">
								{instructor?.name?.charAt(0) || 'I'}
							</div>
						)}
					</div>
					<div>
						<div className="text-lg font-semibold text-black dark:text-white">{instructor?.name || 'Anonymous'}</div>
						<div className="text-sm text-gray-500 dark:text-gray-300">{instructor?.bio || 'No bio available.'}</div>
						{instructor && (instructor as { longBio?: string }).longBio && (
							<div className="text-gray-500 dark:text-gray-300 text-sm mt-1">{(instructor as { longBio?: string }).longBio}</div>
						)}
					</div>
				</div>

				{/* About/Long Description */}
				{(course?.details?.longDescription || course?.description) && (
					<div>
						<h2 className="text-xl font-bold text-black dark:text-white mb-2">About this course</h2>
						<p className="text-gray-500 dark:text-gray-300 text-base leading-relaxed">{course.details?.longDescription || course.description}</p>
					</div>
				)}

				{/* Syllabus */}
				<div>
					<h2 className="text-xl font-bold text-black dark:text-white mb-2 flex items-center gap-2">
						Syllabus
					</h2>
					{isLoading.lessons ? (
						<div className="text-gray-500 dark:text-gray-300">Loading lessons...</div>
					) : lessons && lessons.length > 0 ? (
						<ul className="space-y-3">
							{lessons.map((lesson, idx) => (
								<li key={lesson.id} className="flex items-start gap-3">
									<span className="text-gray-700 dark:text-gray-300 font-bold">{idx + 1}.</span>
									<div>
										<div className="flex items-center gap-2">
											<h3 className="font-semibold text-black dark:text-white">{lesson.title}</h3>
											{isAdmin && (
												<button
													type="button"
													aria-label="View lesson content"
													onClick={() => setOpenLessonContentId(lesson.id)}
													className="ml-1 p-1 rounded-full bg-[#facc15]/20 hover:bg-[#facc15]/40 text-[#facc15] dark:bg-[#232323] dark:hover:bg-[#facc15]/20 dark:text-[#facc15] focus:outline-none focus:ring-2 focus:ring-[#facc15]"
												>
													<AlertCircle className="w-4 h-4" />
												</button>
											)}
										</div>
										<p className="text-gray-500 dark:text-gray-300 text-sm">{lesson.description}</p>
									</div>
								</li>
							))}
						</ul>
					) : (
						<div className="text-gray-500 dark:text-gray-300">No lessons available.</div>
					)}
					{/* Lesson Content Modal */}
					<Dialog open={!!openLessonContentId} onOpenChange={(open) => { if (!open) setOpenLessonContentId(null); }}>
						<DialogContent className="max-w-2xl bg-white/80 dark:bg-[#232323] border border-gray-200 dark:border-gray-700">
							<DialogHeader>
								<DialogTitle className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
									<AlertCircle className="w-5 h-5 text-[#facc15]" /> Lesson Content
								</DialogTitle>
							</DialogHeader>
							{isContentLoading ? (
								<div className="flex flex-col gap-4 py-6 items-center">
									<Skeleton className="h-6 w-2/3 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
									<Skeleton className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
									<Skeleton className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
									<Skeleton className="h-64 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
								</div>
							) : contentError ? (
								<div className="text-red-600 dark:text-red-400 py-6 text-center">Failed to load content.</div>
							) : lessonContent ? (
								<div className="py-2 text-gray-900 dark:text-white text-sm space-y-4">
									<h3 className="text-xl font-bold text-black dark:text-white mb-2 flex items-center gap-2">
										{lessonContent.title}
									</h3>
									{lessonContent.description && (
										<p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-line">{lessonContent.description}</p>
									)}
									{lessonContent.type === 'VIDEO' && (
										resolvedVideoUrl ? (
											<div className="w-full max-w-2xl">
												{videoLoading && (
													<Skeleton className="w-full h-64 max-h-[400px] rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse mb-2" />
												)}
												<video
													key={resolvedVideoUrl}
													controls
													playsInline
													preload="metadata"
													poster={resolvedPosterUrl || "/api/placeholder/800/450"}
													src={resolvedVideoUrl}
													onLoadedData={() => setVideoLoading(false)}
													onCanPlay={() => setVideoLoading(false)}
													onError={() => setVideoLoading(false)}
													className={`${videoLoading ? 'hidden' : ''} w-full max-w-2xl rounded-lg object-cover mb-4`}
													style={{ maxHeight: 400 }}
												>
													Your browser does not support the video tag.
												</video>
											</div>
										) : (
											<Skeleton className="w-full max-w-2xl h-64 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
										)
									)}
									{lessonContent.type === 'DOCUMENT' && resolvedDocUrl && (
										<div className="space-y-2">
											<a
												href={resolvedDocUrl}
												download
												className="inline-block px-4 py-2 bg-[#facc15] text-black dark:bg-[#facc15] dark:text-[#18181b] rounded font-semibold hover:bg-yellow-400 dark:hover:bg-yellow-400 transition-colors mb-2"
											>
												Download Document
											</a>
											{isPdfDoc ? (
												<div className="w-full">
													{docLoading && (
														<Skeleton className="w-full h-[400px] rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
													)}
													<iframe
														src={resolvedDocUrl}
														className={`${docLoading ? 'hidden' : ''} w-full h-[400px] rounded border border-gray-200 dark:border-gray-700`}
														title="Document preview"
														onLoad={() => setDocLoading(false)}
													/>
												</div>
											) : (
												<div className="text-gray-500 dark:text-gray-300">Preview not available for this document type.</div>
											)}
										</div>
									)}
									{lessonContent.type === 'QUIZ' && lessonContent.quizQuestions && lessonContent.quizQuestions.length > 0 && (
										<div className="space-y-4">
											<h4 className="text-lg font-semibold text-black dark:text-[#facc15] mb-2">Quiz Questions</h4>
											{lessonContent.quizQuestions.map((q, i) => (
												<div key={q.id} className="mb-4 p-4 rounded-lg bg-gray-100 dark:bg-[#232323] border border-gray-200 dark:border-gray-700">
													<div className="font-medium text-black dark:text-white mb-2">Q{i + 1}: {q.question}</div>
													<ul className="space-y-1">
														{q.options.map((opt, idx) => (
															<li key={idx} className="text-gray-700 dark:text-gray-300 pl-2">- {opt}</li>
														))}
													</ul>
													<div className="mt-2 text-xs text-green-700 dark:text-green-300">Correct: {q.correctAnswer}</div>
												</div>
											))}
										</div>
									)}
								</div>
							) : (
								<div className="text-gray-500 dark:text-gray-300 py-6 text-center">No content found.</div>
							)}
						</DialogContent>
					</Dialog>
				</div>

				{/* Course Features */}
				<div>
					<h2 className="text-xl font-bold text-black dark:text-white mb-2">This course includes:</h2>
					<ul className="space-y-3">
						<li className="flex items-center text-gray-500 dark:text-gray-300"><svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" /></svg>Full lifetime access</li>
						<li className="flex items-center text-gray-500 dark:text-gray-300"><svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" /></svg>All course materials</li>
						<li className="flex items-center text-gray-500 dark:text-gray-300"><svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" /></svg>Certificate of completion</li>
						<li className="flex items-center text-gray-500 dark:text-gray-300"><svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" /></svg>Downloadable resources</li>
					</ul>
				</div>

				{/* Course Details */}
				<div>
					<h2 className="text-xl font-bold text-black dark:text-white mb-2">Course Details</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<h4 className="font-semibold text-black dark:text-white mb-1">Prerequisites</h4>
							<p className="text-gray-500 dark:text-gray-300">{course?.details?.prerequisites || 'No prerequisites specified.'}</p>
						</div>
						<div>
							<h4 className="font-semibold text-black dark:text-white mb-1">Learning Objectives</h4>
							<p className="text-gray-500 dark:text-gray-300">{course?.details?.objectives || 'No learning objectives specified.'}</p>
						</div>
						<div>
							<h4 className="font-semibold text-black dark:text-white mb-1">Target Audience</h4>
							<p className="text-gray-500 dark:text-gray-300">{course?.details?.targetAudience || 'No target audience specified.'}</p>
						</div>
						<div>
							<h4 className="font-semibold text-black dark:text-white mb-1">Status</h4>
							<p className="text-gray-500 dark:text-gray-300">{course?.deletedAt ? 'Inactive' : 'Active'}</p>
						</div>
						{userRole !== 'USER' && typeof course?.adminSharePercentage === 'number' && (
							<div>
								<h4 className="font-semibold text-black dark:text-white mb-1">Admin Share</h4>
								<p className="text-gray-500 dark:text-gray-300">{course.adminSharePercentage}%</p>
							</div>
						)}
						{userRole !== 'USER' && typeof course?.instructorSharePercentage === 'number' && (
							<div>
								<h4 className="font-semibold text-black dark:text-white mb-1">Instructor Share</h4>
								<p className="text-gray-500 dark:text-gray-300">{course.instructorSharePercentage}%</p>
							</div>
						)}
					</div>
				</div>

				{/* Reviews */}
				{showReviews && (
					<div>
						<h2 className="text-xl font-bold text-black dark:text-white mb-2">Reviews</h2>
						<div className=" rounded-xl ">
							<CourseReviews course={course} isLoading={isLoading.course} userRole={userRole} />
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
