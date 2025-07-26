import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Check,
	X,
	Download,
	Clock,
	AlertCircle,
	Shield,
	Loader2,
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
	const [isApproving, setIsApproving] = useState(false);
	const [isDeclining, setIsDeclining] = useState(false);

	const handleApprove = async () => {
		setIsApproving(true);
		try {
			await onApprove();
		} finally {
			setIsApproving(false);
		}
	};

	const handleDecline = async () => {
		setIsDeclining(true);
		try {
			await onDecline();
		} finally {
			setIsDeclining(false);
		}
	};

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			PENDING: {
				bg: "bg-[#facc15]/20 dark:bg-[#facc15]/10",
				text: "text-[#facc15] dark:text-[#facc15]",
				border: "border-[#facc15] dark:border-[#facc15]",
				icon: Clock,
			},
			APPROVED: {
				bg: "bg-green-100 dark:bg-green-900/40",
				text: "text-green-700 dark:text-green-300",
				border: "border-green-200 dark:border-green-700",
				icon: Check,
			},
			DECLINED: {
				bg: "bg-red-100 dark:bg-red-900/40",
				text: "text-red-700 dark:text-red-300",
				border: "border-red-200 dark:border-red-700",
				icon: X,
			},
			ENABLED: {
				bg: "bg-green-100 dark:bg-green-900/40",
				text: "text-green-700 dark:text-green-300",
				border: "border-green-200 dark:border-green-700",
				icon: Check,
			},
			DISABLED: {
				bg: "bg-gray-100 dark:bg-gray-700",
				text: "text-gray-700 dark:text-gray-300",
				border: "border-gray-200 dark:border-gray-700",
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
			<div className={`rounded-md px-3 py-1 text-xs font-semibold flex items-center gap-1 ${config.bg} ${config.text} ${config.border}`}>
				<Icon className="w-3 h-3" />
				{status}
			</div>
		);
	};

	return (
		<div className="rounded-2xl bg-white/80 dark:bg-[#232326] shadow-xl p-8 space-y-6">
			{/* Instructor Status Section */}
			<div className="space-y-4">
				<div className="flex items-center gap-2 text-black dark:text-[#facc15] text-lg font-semibold">
					<Shield className="w-5 h-5 text-[#facc15] dark:text-[#facc15]" />
					<span>Instructor Status</span>
				</div>
				<div className="space-y-4">
					{/* Approval Status */}
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Approval</span>
						{getStatusBadge(instructor.status)}
					</div>

					{/* Account Status */}
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Account</span>
						{getStatusBadge(instructor.deletedAt ? "DISABLED" : "ENABLED")}
					</div>

					{/* Joined Date */}
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Joined</span>
						<span className="text-sm font-semibold text-black dark:text-white">
							{new Date(instructor.createdAt).toLocaleDateString()}
						</span>
					</div>

					{/* Deleted Date (if applicable) */}
					{instructor.deletedAt && (
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Disabled</span>
							<span className="text-sm font-semibold text-red-600 dark:text-red-400">
								{new Date(instructor.deletedAt).toLocaleDateString()}
							</span>
						</div>
					)}
				</div>
			</div>

			<Separator className="my-6 bg-gray-200 dark:bg-[#232323]" />

			{/* Action Buttons */}
			<div className="space-y-4">
				{instructor.status === "PENDING" && (
					<>
						<Button
							onClick={handleApprove}
							disabled={isApproving}
						>
							{isApproving ? (
								<Loader2 className="w-5 h-5 mr-2 animate-spin flex-shrink-0" />
							) : (
								<Check className="w-5 h-5 mr-2 flex-shrink-0" />
							)}
							<span className="whitespace-nowrap">Approve Instructor</span>
						</Button>
						
						<Button
							onClick={handleDecline}
							disabled={isDeclining}
						>
							{isDeclining ? (
								<Loader2 className="w-5 h-5 mr-2 animate-spin flex-shrink-0" />
							) : (
								<X className="w-5 h-5 mr-2 flex-shrink-0" />
							)}
							<span className="whitespace-nowrap">Decline Instructor</span>
						</Button>
					</>
				)}

				{instructor.status === "DECLINED" && (
					<Button
						onClick={handleApprove}
						disabled={isApproving}
					>
						
						<span className="whitespace-nowrap">Approve Instructor</span>
					</Button>
				)}

				<Button
					onClick={onDownloadCV}
					
				>
					<Download className="w-5 h-5 mr-2 flex-shrink-0" />
					<span className="whitespace-nowrap">
						{instructor.cv && instructor.cv !== "No CV provided"
							? "Download CV"
							: "No CV Available"}
					</span>
				</Button>

				<AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
					<AlertDialogTrigger asChild>
						<Button
						>
						
							<span className="whitespace-nowrap">
								{instructor.deletedAt
									? "Enable Instructor"
									: "Disable Instructor"}
							</span>
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent className="bg-white/80 dark:bg-[#232326] border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
						<AlertDialogHeader>
							<AlertDialogTitle className="text-black dark:text-[#facc15] text-lg font-bold">
								{instructor.deletedAt
									? "Enable Instructor"
									: "Disable Instructor"}
							</AlertDialogTitle>
							<AlertDialogDescription className="text-gray-700 dark:text-gray-300 text-base">
								Are you sure you want to {instructor.deletedAt ? "enable" : "disable"} the instructor &quot;
								{instructor.name || instructor.email}"?
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 text-base font-semibold">
								Cancel
							</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => {
									onToggleDelete();
									setShowDeleteModal(false);
								}}
								className={
									instructor.deletedAt
										? "bg-[#facc15] hover:bg-yellow-400 text-black dark:bg-[#facc15] dark:hover:bg-yellow-400 dark:text-[#18181b] font-semibold text-base py-3"
										: "bg-red-600 hover:bg-red-700 text-white font-semibold text-base py-3"
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
