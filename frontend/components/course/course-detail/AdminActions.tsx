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
		<div className="space-y-4">
			{/* Course Status Section */}
			<div className="space-y-3">
				<div className="flex items-center gap-2 text-gray-900">
					<Shield className="w-4 h-4 text-blue-600" />
					<h3 className="text-sm font-medium">Course Status</h3>
				</div>
				<div className="space-y-3">
					{/* Course Status */}
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600">Status</span>
						<Badge
							className={`${
								course.deletedAt
									? "bg-red-50 text-red-700 border-red-200"
									: course.status === "PUBLISHED"
										? "bg-green-50 text-green-700 border-green-200"
										: course.status === "DRAFT"
											? "bg-yellow-50 text-yellow-700 border-yellow-200"
											: course.status === "ARCHIVED"
												? "bg-gray-50 text-gray-700 border-gray-200"
												: "bg-gray-50 text-gray-700 border-gray-200"
							}`}
						>
							{course.deletedAt ? "Deleted" : course.status || "Unknown"}
						</Badge>
					</div>

					{/* Approval Status */}
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600">Approval</span>
						<Badge
							className={`${
								course.approvalStatus === "APPROVED"
									? "bg-green-50 text-green-700 border-green-200"
									: course.approvalStatus === "PENDING"
										? "bg-yellow-50 text-yellow-700 border-yellow-200"
										: course.approvalStatus === "DECLINED"
											? "bg-red-50 text-red-700 border-red-200"
											: "bg-gray-50 text-gray-700 border-gray-200"
							}`}
						>
							{course.approvalStatus || "No Status"}
						</Badge>
					</div>

					{/* Created Date */}
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600">Created</span>
						<span className="text-sm font-medium text-gray-900">
							{new Date(course.createdAt).toLocaleDateString()}
						</span>
					</div>

					{/* Deleted Date (if applicable) */}
					{course.deletedAt && (
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-600">Deleted</span>
							<span className="text-sm font-medium text-red-600">
								{new Date(course.deletedAt).toLocaleDateString()}
							</span>
						</div>
					)}
				</div>
			</div>

			<Separator />

			{/* Action Buttons */}
			<div className="space-y-3">
				{course.approvalStatus === "PENDING" && (
					<>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									disabled={isApproving}
									size="lg"
									variant="outline"
									className="w-full bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
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
									variant="outline"
									className="w-full bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
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
					</>
				)}

				{course.approvalStatus === "APPROVED" && (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								disabled={isTogglingStatus}
								size="lg"
								variant="outline"
								className="w-full bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
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
									Are you sure you want to{" "}
									{course?.deletedAt ? "enable" : "disable"} &quot;{course.title}"?
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
