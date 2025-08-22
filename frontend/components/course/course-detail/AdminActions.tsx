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
	course?: Course;
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
	if (!course) {
		return null;
	}
	return (
		<div className="rounded-2xl  bg-white/80 dark:bg-[#18181b] p-8  space-y-6">
			{/* Course Status Section */}
			<div className="space-y-4">
				<div className="flex items-center gap-2 text-black dark:text-[#facc15] text-lg font-semibold">
					<Shield className="w-5 h-5 text-[#2563eb] dark:text-[#facc15]" />
					<span>Course Status</span>
				</div>
				<div className="space-y-4">
					{/* Course Status */}
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Status</span>
						<Badge
							className={`rounded-md px-3 py-1 text-xs font-semibold border-0 ${
								course.deletedAt
									? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
									: course.status === "PUBLISHED"
										? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
										: course.status === "DRAFT"
											? "bg-[#facc15]/20 text-[#facc15] dark:bg-[#facc15]/10 dark:text-[#facc15]"
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
						<span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Approval</span>
						<Badge
							className={`rounded-md px-3 py-1 text-xs font-semibold border-0 ${
								course.approvalStatus === "APPROVED"
									? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
									: course.approvalStatus === "PENDING"
										? "bg-[#facc15]/20 text-[#facc15] dark:bg-[#facc15]/10 dark:text-[#facc15]"
										: course.approvalStatus === "DECLINED"
											? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
											: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
							}`}
						>
							{course.approvalStatus || "No Status"}
						</Badge>
					</div>

					{/* Created Date */}
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Created</span>
						<span className="text-sm font-semibold text-gray-900 dark:text-white">
							{new Date(course.createdAt).toLocaleDateString()}
						</span>
					</div>

					{/* Deleted Date (if applicable) */}
					{course.deletedAt && (
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Deleted</span>
							<span className="text-sm font-semibold text-red-600 dark:text-red-400">
								{new Date(course.deletedAt).toLocaleDateString()}
							</span>
						</div>
					)}
				</div>
			</div>
			
			<Separator className="my-6 bg-gray-200 dark:bg-[#232323]" />
			
			{/* Action Buttons */}
			<div className="space-y-4">
				{/* Show Approve button for PENDING or DECLINED courses */}
				{(course.approvalStatus === "PENDING" || course.approvalStatus === "DECLINED") && (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								variant={'primary'}
								disabled={isApproving}
								className="w-full"
							>
								{isApproving ? (
									<Loader2 className="w-5 h-5 mr-2 animate-spin" />
								) : (
									<CheckCircle2 className="w-5 h-5 mr-2" />
								)}
								{course.approvalStatus === "DECLINED" ? "Re-approve Course" : "Approve Course"}
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent className="bg-white/80 dark:bg-[#232326] border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
							<AlertDialogHeader>
								<AlertDialogTitle className="text-black dark:text-[#facc15] text-lg font-bold">
									{course.approvalStatus === "DECLINED" ? "Re-approve Course" : "Approve Course"}
								</AlertDialogTitle>
								<AlertDialogDescription className="text-gray-700 dark:text-gray-300 text-base">
									{course.approvalStatus === "DECLINED" 
										? `Are you sure you want to re-approve "${course.title}"? This will make the course available to students again.`
										: `Are you sure you want to approve "${course.title}"? This will make the course available to students.`
									}
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold text-base">
									Cancel
								</AlertDialogCancel>
								<AlertDialogAction
									onClick={onApprove}
									className="bg-[#facc15] hover:bg-yellow-400 text-black dark:bg-[#facc15] dark:hover:bg-yellow-400 dark:text-[#18181b] font-semibold text-base py-3"
								>
									{course.approvalStatus === "DECLINED" ? "Re-approve" : "Approve"}
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				)}

				{/* Show Decline button for PENDING or APPROVED courses */}
				{(course.approvalStatus === "PENDING" || course.approvalStatus === "APPROVED") && (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
							variant={'primary'}
								disabled={isDeclining}
								className="w-full"
							>
								{isDeclining ? (
									<Loader2 className="w-5 h-5 mr-2 animate-spin" />
								) : (
									<AlertCircle className="w-5 h-5 mr-2" />
								)}
								{course.approvalStatus === "APPROVED" ? "Re-decline Course" : "Decline Course"}
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent className="bg-white/80 dark:bg-[#232326] border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
							<AlertDialogHeader>
								<AlertDialogTitle className="text-black dark:text-[#facc15] text-lg font-bold">
									{course.approvalStatus === "APPROVED" ? "Re-decline Course" : "Decline Course"}
								</AlertDialogTitle>
								<AlertDialogDescription className="text-gray-700 dark:text-gray-300 text-base">
									{course.approvalStatus === "APPROVED"
										? `Are you sure you want to re-decline "${course.title}"? This will reject the course again.`
										: `Are you sure you want to decline "${course.title}"? This will reject the course submission.`
									}
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold text-base">
									Cancel
								</AlertDialogCancel>
								<AlertDialogAction
									onClick={onDecline}
									className="bg-red-600 hover:bg-red-700 text-white font-semibold text-base py-3"
								>
									{course.approvalStatus === "APPROVED" ? "Re-decline" : "Decline"}
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				)}

				{/* Show Enable/Disable button for APPROVED courses */}
				{course.approvalStatus === "APPROVED" && (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								disabled={isTogglingStatus}
								variant={'primary'}
								className="w-full"
							>
								{isTogglingStatus ? (
									<Loader2 className="w-5 h-5 mr-2 animate-spin" />
								) : (
									<Edit2 className="w-5 h-5 mr-2" />
								)}
								{course?.deletedAt ? "Enable Course" : "Disable Course"}
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent className="bg-white/80 dark:bg-[#232326] border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
							<AlertDialogHeader>
								<AlertDialogTitle className="text-black dark:text-[#facc15] text-lg font-bold">
									{course?.deletedAt ? "Enable Course" : "Disable Course"}
								</AlertDialogTitle>
								<AlertDialogDescription className="text-gray-700 dark:text-gray-300 text-base">
									Are you sure you want to {course?.deletedAt ? "enable" : "disable"} &quot;{course.title}"?
									{course?.deletedAt
										? " This will make the course available to students again."
										: " This will hide the course from students."}
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold text-base">
									Cancel
								</AlertDialogCancel>
								<AlertDialogAction
									onClick={onToggleStatus}
									className={
										course?.deletedAt
											? "bg-[#facc15] hover:bg-yellow-400 text-black dark:bg-[#facc15] dark:hover:bg-yellow-400 dark:text-[#18181b] font-semibold text-base py-3"
											: "bg-red-600 hover:bg-red-700 text-white font-semibold text-base py-3"
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
