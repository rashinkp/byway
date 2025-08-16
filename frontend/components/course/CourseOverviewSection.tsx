import { Course } from "@/types/course";
import { Textarea } from "../ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface CourseFormData {
  description: string;
  [key: string]: unknown;
}

export const OverviewSection = ({
	course,
	isEditing,
	form,
}: {
	course?: Course;
	isEditing: boolean;
	form: UseFormReturn<CourseFormData>;
}) => (
	<div className="space-y-4">
		<h2 className="text-xl font-semibold text-gray-900">Overview</h2>
		{isEditing ? (
			<Textarea
				{...form.register("description")}
				className="mt-1 min-h-[100px]"
				placeholder="Course description"
				disabled={form.formState.isSubmitting}
			/>
		) : (
			<p className="text-gray-600">
				{course?.description || "No description available."}
			</p>
		)}
	</div>
);
