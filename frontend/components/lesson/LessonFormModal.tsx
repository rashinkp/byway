// src/components/lesson/LessonFormModal.tsx
"use client";

import { useCreateLesson } from "@/hooks/lesson/useCreateLesson";
import { toast } from "sonner";
import { FormModal, FormFieldConfig } from "../ui/FormModal";
import { LessonFormData, lessonSchema } from "@/lib/validations/lesson";

export const fields: FormFieldConfig<LessonFormData>[] = [
	{
		name: "title",
		label: "Title",
		type: "input",
		fieldType: "text",
		placeholder: "e.g., Introduction to React",
		description: "Enter the title of your lesson.",
		maxLength: 100,
	},
	{
		name: "description",
		label: "Description",
		type: "textarea",
		placeholder: "e.g., Learn the basics of React components",
		description: "Provide a brief description of the lesson (optional).",
		maxLength: 1000,
	},
	{
		name: "order",
		label: "Order",
		type: "input",
		fieldType: "number",
		placeholder: "e.g., 1",
		description: "Enter the order of the lesson.",
	},
];

interface LessonFormModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit?: (data: LessonFormData & { courseId?: string }) => Promise<void>;
	initialData?: Partial<LessonFormData>;
	isSubmitting?: boolean;
	courseId?: string;
}

export function LessonFormModal({
	open,
	onOpenChange,
	onSubmit: externalOnSubmit,
	initialData,
	isSubmitting,
	courseId,
}: LessonFormModalProps) {
	const { mutate: createLesson, isPending } = useCreateLesson();

	const handleSubmit = async (data: LessonFormData) => {
		const submitData = courseId ? { ...data, courseId } : data;

		if (externalOnSubmit) {
			await externalOnSubmit(submitData);
		} else {
			createLesson(
				{
					courseId: courseId!,
					title: data.title,
					description: data.description,
					order: data.order,
				},
				{
					onSuccess: () => {
						onOpenChange(false);
						toast.success("Lesson created successfully");
					},
					onError: (err) => {
						toast.error(err.message || "Failed to create lesson");
					},
				},
			);
		}
	};

	return (
		<FormModal
			open={open}
			onOpenChange={onOpenChange}
			onSubmit={handleSubmit}
			schema={lessonSchema}
			initialData={initialData}
			title={initialData ? "Edit Lesson" : "Create New Lesson"}
			submitText="Save"
			fields={fields}
			description={
				initialData
					? "Update your lesson details."
					: "Create a new lesson by filling out the details."
			}
			isSubmitting={isSubmitting || isPending}
		/>
	);
}
