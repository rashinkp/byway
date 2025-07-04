"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";
import {
	useApproveCourse,
	useDeclineCourse,
} from "@/hooks/course/useApproveCourse";

export function CourseApprovalModal() {
	const [isOpen, setIsOpen] = useState(false);

	// Fetch pending courses (admin role, filter by PENDING approvalStatus)
	const { data, isLoading } = useGetAllCourses({
		role: "ADMIN",
		filterBy: "All", // Admins can see PENDING courses
		includeDeleted: false,
	});

	const pendingCourses =
		data?.items.filter((course) => course.approvalStatus === "PENDING") || [];

	const { mutate: approveCourse, isPending: isApproving } = useApproveCourse();
	const { mutate: declineCourse, isPending: isDeclining } = useDeclineCourse();

	const handleApprove = (courseId: string) => {
		approveCourse({ courseId });
	};

	const handleDecline = (courseId: string) => {
		declineCourse({ courseId });
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
				>
					Review Pending Courses
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[625px]">
				<DialogHeader>
					<DialogTitle>Pending Course Approvals</DialogTitle>
				</DialogHeader>
				<div className="mt-4">
					{isLoading ? (
						<div className="flex justify-center py-4">
							<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
						</div>
					) : pendingCourses.length === 0 ? (
						<div className="text-center py-4 text-gray-500">
							No pending course approvals
						</div>
					) : (
						<div className="space-y-4 max-h-[60vh] overflow-y-auto">
							{pendingCourses.map((course) => (
								<div
									key={course.id}
									className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm"
								>
									<div className="flex-1">
										<p className="font-medium text-gray-800 text-lg">
											{course.title}
										</p>
										<p className="text-sm font-semibold text-blue-600">
											{course.level}
										</p>
										<p className="text-sm text-gray-500 mt-1">
											{course.description}
										</p>
									</div>
									<div className="flex space-x-2">
										<Button
											variant="default"
											size="sm"
											className="bg-green-600 hover:bg-green-700 text-white"
											onClick={() => handleApprove(course.id)}
											disabled={isApproving}
										>
											{isApproving ? (
												<Loader2 className="h-4 w-4 animate-spin" />
											) : (
												"Approve"
											)}
										</Button>
										<Button
											variant="destructive"
											size="sm"
											className="bg-red-600 hover:bg-red-700 text-white"
											onClick={() => handleDecline(course.id)}
											disabled={isDeclining}
										>
											{isDeclining ? (
												<Loader2 className="h-4 w-4 animate-spin" />
											) : (
												"Decline"
											)}
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
