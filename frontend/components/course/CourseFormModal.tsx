"use client";

import { CourseFormData } from "@/types/course";
import { useCreateCourse } from "@/hooks/course/useCreateCourse";
import { useUpdateCourse } from "@/hooks/course/useUpdateCourse";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { FormModal, FormFieldConfig } from "@/components/ui/FormModal";
import { useCategories } from "@/hooks/category/useCategories";
import { useMemo, useState } from "react";
import { courseSchema, courseEditSchema } from "@/lib/validations/course";
import { FileUploadStatus } from "@/components/FileUploadComponent";
import { getPresignedUrl, uploadFileToS3 } from "@/api/file";
import { z } from "zod";

export const baseFields: FormFieldConfig<CourseFormData>[] = [
	{
		name: "title",
		label: "Course Title",
		type: "input",
		fieldType: "text",
		placeholder: "e.g., Introduction to Web Development",
		description: "Enter the title of your course (max 100 characters).",
		maxLength: 100,
	},
	{
		name: "description",
		label: "Short Description",
		type: "textarea",
		placeholder: "e.g., Learn the basics of HTML, CSS, and JavaScript",
		description:
			"Provide a brief overview of the course (max 1000 characters).",
		maxLength: 1000,
	},
	{
		name: "longDescription",
		label: "Detailed Description",
		type: "textarea",
		placeholder: "e.g., In-depth explanation of course content and structure",
		description:
			"Provide a detailed description of the course (max 5000 characters).",
		maxLength: 5000,
	},
	{
		name: "categoryId",
		label: "Category",
		type: "select",
		placeholder: "Select a category",
		description: "Choose the category that best fits your course.",
		options: [],
	},
	{
		name: "price",
		label: "Price (USD)",
		type: "input",
		fieldType: "number",
		placeholder: "e.g., 49.99",
		description: "Set the price for your course (optional).",
	},
	{
		name: "offer",
		label: "Discounted Price (USD)",
		type: "input",
		fieldType: "number",
		placeholder: "e.g., 39.99",
		description: "Set a discounted price for promotions (optional).",
	},
	{
		name: "duration",
		label: "Duration (Hours)",
		type: "input",
		fieldType: "number",
		placeholder: "e.g., 15",
		description: "Specify the total duration of the course in hours.",
	},
	{
		name: "adminSharePercentage",
		label: "Admin Share Percentage *",
		type: "input",
		fieldType: "number",
		placeholder: "Enter percentage (0.01-100)",
		description:
			"Required: Set the percentage of revenue that goes to the platform (must be between 0.01% and 100%).",
		min: 0.01,
		max: 100,
		step: 0.01,
	},
	{
		name: "level",
		label: "Difficulty Level",
		type: "select",
		placeholder: "Select a level",
		description: "Choose the difficulty level of the course.",
		options: [
			{ value: "BEGINNER", label: "Beginner" },
			{ value: "MEDIUM", label: "Intermediate" },
			{ value: "ADVANCED", label: "Advanced" },
		],
	},
	{
		name: "prerequisites",
		label: "Prerequisites",
		type: "textarea",
		placeholder: "e.g., Basic knowledge of programming",
		description:
			"List any prerequisites for the course (optional, max 1000 characters).",
		maxLength: 1000,
	},
	{
		name: "objectives",
		label: "Learning Objectives",
		type: "textarea",
		placeholder: "e.g., Understand core web development concepts",
		description:
			"List the learning objectives of the course (optional, max 2000 characters).",
		maxLength: 2000,
	},
	{
		name: "targetAudience",
		label: "Target Audience",
		type: "textarea",
		placeholder: "e.g., Aspiring web developers",
		description:
			"Describe the intended audience for the course (optional, max 1000 characters).",
		maxLength: 1000,
	},
	{
		name: "thumbnail",
		label: "Thumbnail",
		type: "input",
		fieldType: "file",
		description: "Upload a thumbnail image for the course (max 5MB).",
		accept: "image/*",
		maxSize: 5 * 1024 * 1024, // 5MB
		fileTypeLabel: "image",
	},
];

const statusField: FormFieldConfig<CourseFormData> = {
	name: "status",
	label: "Status",
	type: "select",
	placeholder: "Select status",
	description: "Choose the publication status of the course.",
	options: [
		{ value: "DRAFT", label: "Draft" },
		{ value: "PUBLISHED", label: "Published" },
		{ value: "ARCHIVED", label: "Archived" },
	],
};

interface CourseFormModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialData?: Partial<CourseFormData> & { id?: string };
}

export function CourseFormModal({
	open,
	onOpenChange,
	initialData,
}: CourseFormModalProps) {
	const { user } = useAuthStore();
	const { mutate: createCourse, isPending: isCreating } = useCreateCourse();
	const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();
	const { data, isLoading: categoriesLoading } = useCategories();
	const categories = data?.items;
	const [thumbnailUploadStatus, setThumbnailUploadStatus] =
		useState<FileUploadStatus>(FileUploadStatus.IDLE);
	const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);

	const isEditing = !!initialData?.id;

	const dynamicFields = useMemo(() => {
		const fields = isEditing ? [...baseFields, statusField] : baseFields;

		return fields.map((field) => {
			if (field.name === "categoryId") {
				return {
					...field,
					options:
						categories?.map((category) => ({
							value: category.id,
							label: category.name,
						})) || [],
				};
			}

			if (field.name === "thumbnail") {
				return {
					...field,
					disabled:
						!!initialData?.thumbnail &&
						thumbnailUploadStatus !== FileUploadStatus.ERROR,
					uploadStatus:
						initialData?.thumbnail &&
						thumbnailUploadStatus !== FileUploadStatus.ERROR
							? FileUploadStatus.SUCCESS
							: thumbnailUploadStatus,
					uploadProgress:
						initialData?.thumbnail &&
						thumbnailUploadStatus !== FileUploadStatus.ERROR
							? 100
							: thumbnailUploadProgress,
				};
			}

			return field;
		});
	}, [
		categories,
		initialData,
		thumbnailUploadStatus,
		thumbnailUploadProgress,
		isEditing,
	]);

	const handleSubmit = async (data: z.infer<typeof courseSchema>) => {
		if (!user?.id) {
			toast.error("Instructor ID not found", {
				description: "Please log in to create or update a course.",
			});
			return;
		}

		let finalThumbnailUrl: string | undefined;

		try {
			// Handle thumbnail upload to S3
			if (data.thumbnail instanceof File) {
				setThumbnailUploadStatus(FileUploadStatus.UPLOADING);
				const { uploadUrl, fileUrl } = await getPresignedUrl(
					data.thumbnail.name,
					data.thumbnail.type,
				);
				await uploadFileToS3(data.thumbnail, uploadUrl, (progress) => {
					setThumbnailUploadProgress(progress);
				});
				setThumbnailUploadStatus(FileUploadStatus.SUCCESS);
				finalThumbnailUrl = fileUrl;
			}

			// Prepare data for submission
			const submitData = {
				title: data.title,
				description: data.description,
				level: data.level,
				price: data.price,
				thumbnail: finalThumbnailUrl,
				duration: data.duration,
				offer: data.offer,
				categoryId: data.categoryId,
				prerequisites: data.prerequisites,
				longDescription: data.longDescription,
				objectives: data.objectives,
				targetAudience: data.targetAudience,
				adminSharePercentage: data.adminSharePercentage || 20,
			};

			if (isEditing && initialData?.id) {
				// Update existing course
				updateCourse({
					data: {
						...submitData,
						status:
							(data as z.infer<typeof courseEditSchema>).status ||
							initialData.status ||
							"DRAFT",
					},
					id: initialData.id,
				});
			} else {
				// Create new course
				createCourse({
					...submitData,
					status: "DRAFT",
				});
			}
		} catch (error: any) {
			toast.error("An error occurred", {
				description:
					error.message || "Failed to submit the form. Please try again.",
			});
			setThumbnailUploadStatus(FileUploadStatus.ERROR);
			setThumbnailUploadProgress(0);
		} finally {
			onOpenChange(false);
		}
	};

	return (
		<FormModal
			open={open}
			onOpenChange={onOpenChange}
			onSubmit={handleSubmit}
			schema={isEditing ? courseEditSchema : courseSchema}
			initialData={
				initialData
					? {
							title: initialData.title,
							description: initialData.description,
							level: initialData.level,
							price: initialData.price ?? undefined,
							duration: initialData.duration ?? undefined,
							offer: initialData.offer ?? undefined,
							thumbnail: initialData.thumbnail,
							categoryId: initialData.categoryId,
							prerequisites: initialData.prerequisites,
							longDescription: initialData.longDescription,
							objectives: initialData.objectives,
							targetAudience: initialData.targetAudience,
							status: initialData.status,
							adminSharePercentage: initialData.adminSharePercentage ?? 20,
						}
					: undefined
			}
			title={isEditing ? "Edit Course" : "Create New Course"}
			submitText="Save"
			fields={dynamicFields as FormFieldConfig<z.infer<typeof courseSchema>>[]}
			description={
				isEditing
					? "Update your course details."
					: "Create a new course by filling out the details."
			}
			isSubmitting={isCreating || isUpdating || categoriesLoading}
		/>
	);
}
