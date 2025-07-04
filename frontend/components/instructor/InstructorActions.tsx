import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	Check,
	X,
	Download,
	Clock,
	AlertCircle,
	Shield,
} from "lucide-react";
import { IInstructorDetails } from "@/types/instructor";
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

interface InstructorActionsProps {
	instructor: IInstructorDetails;
	onApprove: () => Promise<void>;
	onDecline: () => Promise<void>;
	onToggleDelete: () => void;
	onDownloadCV: () => void;
}

export default function InstructorActions({
	instructor,
	onApprove,
	onDecline,
	onToggleDelete,
	onDownloadCV,
}: InstructorActionsProps) {
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			PENDING: {
				bg: "bg-yellow-50",
				text: "text-yellow-700",
				border: "border-yellow-200",
				icon: Clock,
			},
			APPROVED: {
				bg: "bg-green-50",
				text: "text-green-700",
				border: "border-green-200",
				icon: Check,
			},
			REJECTED: {
				bg: "bg-red-50",
				text: "text-red-700",
				border: "border-red-200",
				icon: X,
			},
			ENABLED: {
				bg: "bg-green-50",
				text: "text-green-700",
				border: "border-green-200",
				icon: Check,
			},
			DISABLED: {
				bg: "bg-red-50",
				text: "text-red-700",
				border: "border-red-200",
				icon: X,
			},
		};

		const config = statusConfig[status as keyof typeof statusConfig] || {
			bg: "bg-gray-50",
			text: "text-gray-700",
			border: "border-gray-200",
			icon: AlertCircle,
		};
		const Icon = config.icon;

		return (
			<Badge className={`${config.bg} ${config.text} ${config.border}`}>
				<Icon className="w-3 h-3 mr-1" />
				{status}
			</Badge>
		);
	};

	return (
		<div className="space-y-4">
			{/* Instructor Status Section */}
			<div className="space-y-3">
				<div className="flex items-center gap-2 text-gray-900">
					<Shield className="w-4 h-4 text-blue-600" />
					<h3 className="text-sm font-medium">Instructor Status</h3>
				</div>
				<div className="space-y-3">
					{/* Approval Status */}
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600">Approval</span>
						{getStatusBadge(instructor.status)}
					</div>

					{/* Account Status */}
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600">Account</span>
						{getStatusBadge(instructor.deletedAt ? "DISABLED" : "ENABLED")}
					</div>

					{/* Joined Date */}
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600">Joined</span>
						<span className="text-sm font-medium text-gray-900">
							{new Date(instructor.createdAt).toLocaleDateString()}
						</span>
					</div>

					{/* Deleted Date (if applicable) */}
					{instructor.deletedAt && (
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-600">Disabled</span>
							<span className="text-sm font-medium text-red-600">
								{new Date(instructor.deletedAt).toLocaleDateString()}
							</span>
						</div>
					)}
				</div>
			</div>

			<Separator />

			{/* Action Buttons */}
			<div className="space-y-3">
				{instructor.status === "PENDING" && (
					<>
						<Button
							onClick={onApprove}
							size="lg"
							variant="outline"
							className="w-full bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
						>
							<Check className="w-4 h-4 mr-2" />
							Approve Instructor
						</Button>
						<Button
							onClick={onDecline}
							size="lg"
							variant="outline"
							className="w-full bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
						>
							<X className="w-4 h-4 mr-2" />
							Decline Instructor
						</Button>
					</>
				)}

				{instructor.status === "REJECTED" && (
					<Button
						onClick={onApprove}
						size="lg"
						variant="outline"
						className="w-full bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
					>
						<Check className="w-4 h-4 mr-2" />
						Approve Instructor
					</Button>
				)}

				<Button
					onClick={onDownloadCV}
					size="lg"
					variant="outline"
					className={`w-full ${
						instructor.cv && instructor.cv !== "No CV provided"
							? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
							: "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
					}`}
					disabled={!instructor.cv || instructor.cv === "No CV provided"}
				>
					<Download className="w-4 h-4 mr-2" />
					{instructor.cv && instructor.cv !== "No CV provided"
						? "Download CV"
						: "No CV Available"}
				</Button>

				<AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
					<AlertDialogTrigger asChild>
						<Button
							size="lg"
							variant="outline"
							className={`w-full ${
								instructor.deletedAt
									? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
									: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
							}`}
						>
							{instructor.deletedAt ? (
								<Check className="w-4 h-4 mr-2" />
							) : (
								<X className="w-4 h-4 mr-2" />
							)}
							{instructor.deletedAt
								? "Enable Instructor"
								: "Disable Instructor"}
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{instructor.deletedAt
									? "Enable Instructor"
									: "Disable Instructor"}
							</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to{" "}
								{instructor.deletedAt ? "enable" : "disable"} the instructor &quot;
								{instructor.name || instructor.email}"?
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => {
									onToggleDelete();
									setShowDeleteModal(false);
								}}
								className={
									instructor.deletedAt
										? "bg-green-600 hover:bg-green-700"
										: "bg-red-600 hover:bg-red-700"
								}
							>
								{instructor.deletedAt ? "Enable" : "Disable"}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	);
}
