"use client";

import { Course } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Edit, Loader2, Eye, EyeOff } from "lucide-react";

export const ActionSection = ({
	course,
	isEditing,
	isUpdating,
	onPublish,
	setIsModalOpen,
}: {
	course: Course;
	isEditing: boolean;
	isUpdating: boolean;
	onPublish: () => void;
	setIsModalOpen: (value: boolean) => void;
}) => {
	return (
		<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
			<div>
				<h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
					Course Actions
				</h3>
				<p className="text-xs text-gray-500 dark:text-gray-300">
					Manage your course settings and visibility
				</p>
			</div>

			<div className="flex flex-wrap items-center gap-3">
				<Button
					onClick={() => setIsModalOpen(true)}
					disabled={!course}
					className="border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200  shadow-sm rounded-lg px-4 py-2 h-10"
				>
					<Edit className="mr-2 h-4 w-4" />
					<span className="font-medium">Edit Details</span>
				</Button>

				<Button
					onClick={onPublish}
					disabled={isEditing || isUpdating}
					className={`transition-all duration-200 shadow-md rounded-lg px-5 py-2 h-10 font-medium ${
						course.status === "PUBLISHED"
							? "bg-amber-500 hover:bg-amber-600 text-white border-amber-600"
							: "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600"
					}`}
				>
					{isUpdating ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : course.status === "PUBLISHED" ? (
						<EyeOff className="mr-2 h-4 w-4" />
					) : (
						<Eye className="mr-2 h-4 w-4" />
					)}
					{course.status === "PUBLISHED" ? "Unpublish" : "Publish"}
				</Button>
			</div>
		</div>
	);
};
