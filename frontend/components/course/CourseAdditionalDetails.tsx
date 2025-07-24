"use client";

import { Course } from "@/types/course";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";

interface AdditionalDetailsSectionProps {
	course?: Course;
}

export function AdditionalDetailsSection({
	course,
}: AdditionalDetailsSectionProps) {
	const status = course?.deletedAt ? "Inactive" : "Active";

	return (
		<TabsContent value="details" className="mt-0">
			<div className="space-y-6">
				{/* Status Indicator */}
				<div>
					<h3 className="text-lg font-semibold text-black dark:text-white">Status</h3>
					<Badge
						className={
							status === "Active"
								? "bg-[#facc15] text-black dark:bg-[#facc15] dark:text-[#18181b]"
								: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-white"
						}
					>
						{status}
					</Badge>
				</div>

				{/* Prerequisites */}
				<div>
					<h3 className="text-lg font-semibold text-black dark:text-white">Prerequisites</h3>
					<p className="text-gray-700 dark:text-gray-300">
						{course?.details?.prerequisites || "No prerequisites specified."}
					</p>
				</div>

				{/* Long Description */}
				<div>
					<h3 className="text-lg font-semibold text-black dark:text-white">
						Detailed Description
					</h3>
					<p className="text-gray-700 dark:text-gray-300">
						{course?.details?.longDescription ||
							"No detailed description available."}
					</p>
				</div>

				{/* Learning Objectives */}
				<div>
					<h3 className="text-lg font-semibold text-black dark:text-white">
						Learning Objectives
					</h3>
					<p className="text-gray-700 dark:text-gray-300">
						{course?.details?.objectives || "No learning objectives specified."}
					</p>
				</div>

				{/* Target Audience */}
				<div>
					<h3 className="text-lg font-semibold text-black dark:text-white">
						Target Audience
					</h3>
					<p className="text-gray-700 dark:text-gray-300">
						{course?.details?.targetAudience || "No target audience specified."}
					</p>
				</div>
			</div>
		</TabsContent>
	);
}
