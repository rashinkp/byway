"use client";

import { useState, useEffect } from "react";
import { Pagination } from "@/components/ui/Pagination";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Course } from "@/types/course";
import { useGetEnrolledCourses } from "@/hooks/course/useGetEnrolledCourses";
import { motion } from "framer-motion";
import { CourseCard } from "@/components/course/CourseCard";
import { CourseCardSkeleton } from "@/components/course/CourseCardSkeleton";
import Link from "next/link";
import { BookOpen, Loader2 } from "lucide-react";

export default function MyCoursesSection() {
	const itemsPerPage = 8;
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoaded, setIsLoaded] = useState(false);

	const { data, isLoading, error } = useGetEnrolledCourses({
		page: currentPage,
		limit: itemsPerPage,
		sortBy: "enrolledAt",
		sortOrder: "desc",
		search: "",
		level: "All",
	});

	const courses: Course[] = data?.items ?? [];

	// Calculate pagination values
	const totalPages = data?.totalPages ?? 1;

	// Handle animation loading state
	useEffect(() => {
		if (!isLoading) {
			setIsLoaded(true);
		}
	}, [isLoading]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	if (error) {
		return (
			<ErrorDisplay
				title="My Courses Error"
				description="Error occurred while getting your courses"
				error={error}
			/>
		);
	}

	if (!isLoading && (!courses || courses.length === 0)) {
		return (
			<div className="text-center py-12">
				<div className="w-24 h-24 mx-auto mb-4 text-[var(--color-primary)]">
					<BookOpen className="w-full h-full" />
				</div>
				<h3 className="text-lg font-medium text-[var(--color-primary-dark)] mb-2">
					No courses enrolled yet
				</h3>
				<p className="text-[var(--color-muted)] mb-4">
					Start your learning journey by enrolling in your first course!
				</p>
				<Link
					href="/courses"
					className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[var(--color-surface)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-colors duration-200"
				>
					Browse Courses
				</Link>
			</div>
		);
	}

	// Animation variants for staggered appearance (from CourseGrid)
	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	return (
		<div className="w-full">
			<div className="bg-white dark:bg-[#232326] rounded-xl p-8 mb-8 text-center">
				<h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">My Courses</h1>
				<p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
					Access all your enrolled courses here. Continue your learning journey and track your progress across all your courses.
				</p>
			</div>

			{/* Loading State */}
			{isLoading && (
				<div className="w-full">
					<div className="flex items-center justify-center mb-6">
						<Loader2 className="w-6 h-6 text-[#facc15] animate-spin mr-2" />
						<span className="text-gray-600 dark:text-gray-300 font-medium">Loading your courses...</span>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
						{Array.from({ length: itemsPerPage }).map((_, index) => (
							<div key={index} className="w-full max-w-xs mx-auto">
								<CourseCardSkeleton />
							</div>
						))}
					</div>
				</div>
			)}

			{/* Course Grid */}
			{!isLoading && (
				<motion.div
					className="w-full"
					variants={containerVariants}
					initial="hidden"
					animate={isLoaded ? "show" : "hidden"}
				>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
						{courses.map((course) => (
							<motion.div
								key={course.id}
								className="w-full max-w-xs mx-auto"
								variants={{
									hidden: { opacity: 0, y: 20 },
									show: {
										opacity: 1,
										y: 0,
										transition: { duration: 0.4, ease: "easeOut" },
									},
								}}
							>
								<Link href={`/courses/${course.id}`} className="block h-full">
									<CourseCard
										course={course}
										className="w-full h-full hover:shadow-lg transition-shadow duration-300 bg-[var(--color-background)]"
									/>
								</Link>
							</motion.div>
						))}
					</div>
				</motion.div>
			)}

			{/* Pagination */}
			{!isLoading && totalPages > 1 && (
				<div className="mt-8">
					<Pagination
						totalPages={totalPages}
						currentPage={currentPage}
						onPageChange={handlePageChange}
					/>
				</div>
			)}
		</div>
	);
}
