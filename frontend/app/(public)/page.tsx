"use client";

import { useCategories } from "@/hooks/category/useCategories";
import { useRouter } from "next/navigation";
import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";
import { useGetAllInstructors } from "@/hooks/instructor/useGetAllInstructor";
import LearningBanner from "@/components/banners/KnowledgePluseBanner";
import { TopCourses } from "@/components/course/TopCourseList";
import { CategoriesSection } from "@/components/category/CategorySection";
import { HowItWorksSection } from "@/components/common/HowItWorksSection";
import { SectionGrid } from "@/components/common/SectionGrid";
import { InstructorCard } from "@/components/instructor/InstructorCard";
import { motion } from "framer-motion";

export default function UserDashboard() {
	const router = useRouter();
	const { data: categoriesData, isLoading: isCategoriesLoading } =
		useCategories({
			page: 1,
			limit: 4,
			filterBy: "Active",
		});

	const { data: coursesData } = useGetAllCourses({
		page: 1,
		limit: 10,
		role: "USER",
	});

	const { data: instructorsData } =
		useGetAllInstructors({
			page: 1,
			limit: 4,
			sortBy: "createdAt",
			sortOrder: "desc",
			filterBy: "Approved",
			includeDeleted: false,
		});

	const handleCategoryClick = (categoryId: string) => {
		router.push(`/courses?category=${categoryId}`);
	};

	const categories =
		categoriesData?.items.map((category) => ({
			id: category.id,
			name: category.name,
			description: category.description || "",
		})) || [];

	const topCourses = coursesData?.items || [];

	const topInstructors =
		instructorsData?.data.items.map((instructor) => ({
			id: instructor.id,
			areaOfExpertise: instructor.areaOfExpertise,
			professionalExperience: instructor.professionalExperience,
			about: instructor.about || "",
			website: instructor.website || "",
			education: instructor.education || "",
			certifications: instructor.certifications || "",
			totalStudents: instructor.totalStudents,
			user: {
				...instructor.user,
				avatar:
					instructor.user.avatar ||
					`https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.user.name)}&background=random`,
			},
		})) || [];

	return (
		<div className="relative min-h-screen bg-white dark:bg-neutral-900 text-black dark:text-white gap-y-8 flex flex-col">
			{/* Hero Section with banner background */}
			<div className="relative w-full h-[60vh] sm:h-[80vh] flex items-center justify-center overflow-hidden mt-16">
				<LearningBanner />
				<motion.section
					className="absolute inset-0 flex flex-col items-center justify-center h-full w-full text-center z-10"
				>
					<span className="tracking-[0.3em] text-xs sm:text-sm font-semibold text-[#facc15] mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">BYWAY</span>
					<h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#facc15] drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)] mb-4">
						Knowledge Meets <span className="block">Innovation</span>
					</h1>
					<p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl dark:text-white/90 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
						This platform's simplicity belies its powerful capabilities, offering a seamless and enjoyable educational experience.
					</p>
				</motion.section>
			</div>
			<div className="container relative z-10 w-full px-4 sm:px-6 md:px-8 mx-auto">
				<motion.section
					initial={{ opacity: 0, y: 60 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.3, ease: "easeOut" }}
					className="w-full relative rounded-2xl shadow-lg py-14 sm:py-20 my-28"
				>
					<div className="max-w-7xl mx-auto w-full px-0 sm:px-4 md:px-8">
						<CategoriesSection
							categories={categories}
							isLoading={isCategoriesLoading}
							onCategoryClick={handleCategoryClick}
						/>
					</div>
				</motion.section>
				<motion.section
					initial={{ opacity: 0, y: 60 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.3, ease: "easeOut" }}
					className="my-50"
				>
					<div className="max-w-7xl mx-auto w-full px-0 sm:px-4 md:px-8">
						<TopCourses courses={topCourses} router={router} />
					</div>
				</motion.section>
				<motion.section
					initial={{ opacity: 0, y: 60 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.3, ease: "easeOut" }}
					className="w-full relative rounded-2xl shadow-lg py-4 sm:py-20 my-28"
				>
					<div className="max-w-7xl mx-auto w-full px-0 sm:px-4 md:px-8">
						<HowItWorksSection />
					</div>
				</motion.section>
				<motion.section
					initial={{ opacity: 0, y: 60 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.3, ease: "easeOut" }}
					className="my-28"
				>
					<div className="max-w-7xl mx-auto w-full px-0 sm:px-4 md:px-8">
						<SectionGrid
							title={
								<span>
									<span className="text-[#facc15] dark:text-[#facc15]">Meet</span> our professional{' '}
									<span className="inline-block relative">
										mentors.
										<svg
											className="absolute -bottom-2 left-0 w-full h-3"
											viewBox="0 0 120 12"
											fill="none"
										>
											<path
												d="M0 10 Q60 0 120 10"
												stroke="#facc15"
												strokeWidth="2"
												fill="none"
											/>
										</svg>
									</span>
								</span>
							}
							items={topInstructors}
							renderCard={(instructor) => (
								<InstructorCard instructor={instructor} />
							)}
							showNavigation={true}
						/>
					</div>
				</motion.section>
				<motion.section
					initial={{ opacity: 0, y: 60 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.3, ease: "easeOut" }}
					className="w-full relative rounded-2xl shadow-lg py-14 sm:py-20 my-28 bg-white dark:bg-neutral-800"
				>
					<div className="max-w-2xl mx-auto w-full px-0 sm:px-4 md:px-8 text-left sm:text-left text-center">
						<div className="flex justify-center sm:justify-start mb-4 w-full">
							<svg
								width="56"
								height="40"
								viewBox="0 0 56 40"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<text
									x="0"
									y="32"
									fontSize="56"
									fill="#facc15]"
									fontWeight="bold"
								>
									"
								</text>
							</svg>
						</div>
						<h2 className="text-2xl font-bold mb-4 text-[#facc15]">
							Testimonial
						</h2>
						<p className="text-lg dark:text-white mb-8 font-medium">
							"Since implementing Byway, our organization has witnessed a
							remarkable transformation in how we approach learning. The
							platform&apos;s simplicity belies its powerful capabilities,
							offering a seamless and enjoyable educational experience. The
							efficiency with which we can now manage courses, track progress,
							and foster collaboration among learners is truly impressive."
						</p>
						<div className="flex flex-col items-start gap-2">
							<span className="font-semibold text-[#facc15]">
								Byway
							</span>
						</div>
					</div>
				</motion.section>
			</div>
		</div>
	);
}
