import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	CheckCircle2,
	AlertCircle,
	Edit2,
	Loader2,
	Shield,
} from "lucide-react";
import { Course } from "@/types/course";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AdminActionsProps {
	course: Course;
	isApproving: boolean;
	isDeclining: boolean;
	isTogglingStatus: boolean;
	onApprove: () => void;
	onDecline: () => void;
	onToggleStatus: () => void;
}

export default function AdminActions({
	course,
	isApproving,
	isDeclining,
	isTogglingStatus,
	onApprove,
	onDecline,
	onToggleStatus,
}: AdminActionsProps) {
	return (
		<div className="rounded-xl dark:border-gray-700 bg-white dark:bg-[#18181b] p-6 shadow-sm space-y-6">
			{/* Course Status Section */}
			<div className="space-y-4">
				<div className="flex items-center gap-2 text-gray-900 dark:text-[#facc15]">
					<Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
					<h3 className="text-sm font-medium">Course Status</h3>
				</div>
				<div className="space-y-3">
					{/* Course Status */}
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600 dark:text-gray-300">Status</span>
						<Badge
							className={`rounded-md px-2 py-1 text-xs font-semibold border-0 ${
								course.deletedAt
									? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
									: course.status === "PUBLISHED"
										? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
										: course.status === "DRAFT"
											? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
											: course.status === "ARCHIVED"
												? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
												: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
							}`}
						>
							{course.deletedAt ? "Deleted" : course.status || "Unknown"}
						</Badge>
					</div>

					{/* Approval Status */}
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600 dark:text-gray-300">Approval</span>
						<Badge
							className={`rounded-md px-2 py-1 text-xs font-semibold border-0 ${
								course.approvalStatus === "APPROVED"
									? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
									: course.approvalStatus === "PENDING"
										? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
										: course.approvalStatus === "DECLINED"
											? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
											: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
							}`}
						>
							{course.approvalStatus || "No Status"}
						</Badge>
					</div>

					{/* Created Date */}
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600 dark:text-gray-300">Created</span>
						<span className="text-sm font-medium text-gray-900 dark:text-white">
							{new Date(course.createdAt).toLocaleDateString()}
						</span>
					</div>

					{/* Deleted Date (if applicable) */}
					{course.deletedAt && (
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-600 dark:text-gray-300">Deleted</span>
							<span className="text-sm font-medium text-red-600 dark:text-red-400">
								{new Date(course.deletedAt).toLocaleDateString()}
							</span>
						</div>
					)}
				</div>
			</div>
			<Separator className="my-4 dark:bg-gray-700" />
			{/* Action Buttons */}
			<div className="space-y-3">
				{course.approvalStatus === "PENDING" && (
					<div className="flex flex-col gap-3">
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									disabled={isApproving}
									size="lg"
									className="w-full bg-green-500/10 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-0 hover:bg-green-500/20 dark:hover:bg-green-900/50"
								>
									{isApproving ? (
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									) : (
										<CheckCircle2 className="w-4 h-4 mr-2" />
									)}
									Approve Course
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Approve Course</AlertDialogTitle>
									<AlertDialogDescription>
										Are you sure you want to approve &quot;{course.title}"? This will
										make the course available to students.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={onApprove}
										className="bg-green-600 hover:bg-green-700"
									>
										Approve
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									disabled={isDeclining}
									size="lg"
									className="w-full bg-red-500/10 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-0 hover:bg-red-500/20 dark:hover:bg-red-900/50"
								>
									{isDeclining ? (
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									) : (
										<AlertCircle className="w-4 h-4 mr-2" />
									)}
									Decline Course
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Decline Course</AlertDialogTitle>
									<AlertDialogDescription>
										Are you sure you want to decline &quot;{course.title}"? This will
										reject the course submission.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={onDecline}
										className="bg-red-600 hover:bg-red-700"
									>
										Decline
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				)}

				{course.approvalStatus === "APPROVED" && (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								disabled={isTogglingStatus}
								size="lg"
								className={`w-full border-0 ${
									course?.deletedAt
										? "bg-green-500/10 text-green-700 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-500/20 dark:hover:bg-green-900/50"
										: "bg-red-500/10 text-red-700 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-500/20 dark:hover:bg-red-900/50"
								}`}
							>
								{isTogglingStatus ? (
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								) : (
									<Edit2 className="w-4 h-4 mr-2" />
								)}
								{course?.deletedAt ? "Enable Course" : "Disable Course"}
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									{course?.deletedAt ? "Enable Course" : "Disable Course"}
								</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure you want to {course?.deletedAt ? "enable" : "disable"} &quot;{course.title}"?
									{course?.deletedAt
										? " This will make the course available to students again."
										: " This will hide the course from students."}
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={onToggleStatus}
									className={
										course?.deletedAt
											? "bg-green-600 hover:bg-green-700"
											: "bg-red-600 hover:bg-red-700"
									}
								>
									{course?.deletedAt ? "Enable" : "Disable"}
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				)}
			</div>
		</div>
	);
}
