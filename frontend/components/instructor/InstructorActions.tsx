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
				bg: "bg-[#facc15]/20 dark:bg-[#facc15]/10",
				text: "text-[#facc15] dark:text-[#facc15]",
				border: "border-[#facc15] dark:border-[#facc15]",
				icon: Clock,
			},
			APPROVED: {
				bg: "bg-white/80 dark:bg-[#232323]",
				text: "text-black dark:text-white",
				border: "border-gray-200 dark:border-gray-700",
				icon: Check,
			},
			REJECTED: {
				bg: "bg-red-100 dark:bg-red-900/40",
				text: "text-red-700 dark:text-red-300",
				border: "border-red-200 dark:border-red-700",
				icon: X,
			},
			ENABLED: {
				bg: "bg-white/80 dark:bg-[#232323]",
				text: "text-black dark:text-white",
				border: "border-gray-200 dark:border-gray-700",
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
			<div className={`rounded-xl border ${config.bg} ${config.text} ${config.border} px-2 py-1 text-xs font-semibold flex items-center gap-1`}>
				<Icon className="w-3 h-3 mr-1" />
				{status}
			</div>
		);
	};

	return (
		<div className="rounded-2xl  bg-white/80 dark:bg-[#232326] shadow-xl p-8 space-y-6">
			{/* Instructor Status Section */}
			<div className="space-y-4">
				<div className="flex items-center gap-2 text-black dark:text-[#facc15] text-lg font-semibold">
					<Shield className="w-5 h-5 text-[#facc15] dark:text-[#facc15]" />
					<span>Instructor Status</span>
				</div>
				<div className="space-y-3">
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

			<Separator className="my-4 bg-gray-200 dark:bg-[#232323]" />

			{/* Action Buttons */}
			<div className="space-y-4">
				{instructor.status === "PENDING" && (
					<>
						<Button
							onClick={onApprove}
							size="lg"
							variant="default"
							className="w-full bg-[#facc15] text-black dark:bg-[#facc15] dark:text-[#18181b] border-0 hover:bg-yellow-400 dark:hover:bg-yellow-400 font-semibold text-base py-3"
						>
							<Check className="w-5 h-5 mr-2" />
							Approve Instructor
						</Button>
						<Button
							onClick={onDecline}
							size="lg"
							variant="secondary"
							className="w-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-0 hover:bg-red-200 dark:hover:bg-red-900/60 font-semibold text-base py-3"
						>
							<X className="w-5 h-5 mr-2" />
							Decline Instructor
						</Button>
					</>
				)}

				{instructor.status === "REJECTED" && (
					<Button
						onClick={onApprove}
						size="lg"
						variant="default"
						className="w-full bg-[#facc15] text-black dark:bg-[#facc15] dark:text-[#18181b] border-0 hover:bg-yellow-400 dark:hover:bg-yellow-400 font-semibold text-base py-3"
					>
						<Check className="w-5 h-5 mr-2" />
						Approve Instructor
					</Button>
				)}

				<Button
					onClick={onDownloadCV}
					size="lg"
					variant="default"
					className={`w-full ${
						instructor.cv && instructor.cv !== "No CV provided"
							? "bg-[#facc15]/10 text-[#facc15] dark:bg-[#232323] dark:text-[#facc15] border-0 hover:bg-[#facc15]/20 dark:hover:bg-[#facc15]/20 font-semibold text-base py-3"
							: "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-400 border-0 cursor-not-allowed text-base py-3"
					}`}
					disabled={!instructor.cv || instructor.cv === "No CV provided"}
				>
					<Download className="w-5 h-5 mr-2" />
					{instructor.cv && instructor.cv !== "No CV provided"
						? "Download CV"
						: "No CV Available"}
				</Button>

				<AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
					<AlertDialogTrigger asChild>
						<Button
							size="lg"
							variant={instructor.deletedAt ? "default" : "secondary"}
							className={`w-full ${
								instructor.deletedAt
									? "bg-[#facc15]/10 text-[#facc15] dark:bg-[#232323] dark:text-[#facc15] border-0 hover:bg-[#facc15]/20 dark:hover:bg-[#facc15]/20 font-semibold text-base py-3"
									: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-0 hover:bg-red-200 dark:hover:bg-red-900/60 font-semibold text-base py-3"
							}`}
						>
							{instructor.deletedAt ? (
								<Check className="w-5 h-5 mr-2" />
							) : (
								<X className="w-5 h-5 mr-2" />
							)}
							{instructor.deletedAt
								? "Enable Instructor"
								: "Disable Instructor"}
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
