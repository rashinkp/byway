"use client";
import { Course } from "@/types/course";
import { StaticImageData } from "next/image";
import { useState } from "react";
import { ImageSection } from "./CourseDetailsImageSection";
import { DetailsSection } from "./CourseDetailsSection";

import { ActionSection } from "./CourseActionSection";
import { CourseFormModal } from "./CourseFormModal";

export function CourseDetails({
	course,
	src,
	alt,
	isLoading,
}: {
	course?: Course;
	src: string | StaticImageData;
	alt: string;
	isLoading: boolean;
}) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const onPublish = () => {
		if (!course) return;
		setIsModalOpen(true);
	};

	if (isLoading) {
		return (
			<div className="bg-[var(--color-surface)] border border-[var(--color-primary-light)]/20 shadow-sm rounded-xl p-6">
				<div className="animate-pulse space-y-4">
					<div className="h-32 w-32 bg-[var(--color-background)] rounded"></div>
					<div className="h-4 w-3/4 bg-[var(--color-background)] rounded"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="bg-[var(--color-surface)] border border-[var(--color-primary-light)]/20 shadow-sm rounded-xl p-6">
				<div className="flex flex-col md:flex-row gap-6">
					<ImageSection src={src} alt={alt} />
					<div className="flex-1">
						<DetailsSection course={course} />
					</div>
				</div>
			</div>

			{course && (
				<div className="bg-[var(--color-surface)] border border-[var(--color-primary-light)]/20 shadow-sm rounded-xl p-6">
					<ActionSection
						course={course}
						isUpdating={false}
						onPublish={onPublish}
						isEditing={isLoading}
						setIsModalOpen={setIsModalOpen}
					/>
				</div>
			)}

			{course && (
				<CourseFormModal
					open={isModalOpen}
					onOpenChange={setIsModalOpen}
					initialData={{
						id: course.id,
						title: course.title,
						description: course.description || undefined,
						level: course.level,
						price: Number(course.price) || undefined,
						duration: course.duration || 0,
						offer: Number(course.offer) || undefined,
						status: course.status,
						thumbnail: course.thumbnail || undefined,
						categoryId: course.categoryId,
						prerequisites: course.details?.prerequisites || undefined,
						longDescription: course.details?.longDescription || undefined,
						objectives: course.details?.objectives || undefined,
						targetAudience: course.details?.targetAudience || undefined,
						adminSharePercentage: course.adminSharePercentage || 20,
					}}
				/>
			)}
		</div>
	);
}
