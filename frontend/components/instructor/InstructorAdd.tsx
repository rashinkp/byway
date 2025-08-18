"use client";
import { FormModal } from "@/components/ui/FormModal";
import { useGetInstructorByUserId } from "@/hooks/instructor/useGetInstructorByUserId";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Clock } from "lucide-react";
import { useFileUpload } from "@/hooks/file/useFileUpload";
import { Button } from "../ui/button";
import { InstructorFormModalProps } from "@/types/instructor";
import { fields, InstructorFormData, instructorSchema } from "@/lib/validations/instructor";
import { Loader2 } from "lucide-react";


export function InstructorFormModal({
	open,
	onOpenChange,
	onSubmit,
	initialData,
	isSubmitting,
}: InstructorFormModalProps) {
	const { user } = useAuthStore();
	const { data: instructorData, isLoading: isInstructorLoading } =
		useGetInstructorByUserId(open);
	const [timeLeft, setTimeLeft] = useState<number | null>(null);
	const { uploadFile, isUploading } = useFileUpload();

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		const calculateTimeLeft = () => {
			if (
				instructorData?.data?.status === "DECLINED" &&
				instructorData.data.updatedAt
			) {
				const updatedAt = new Date(instructorData.data.updatedAt);
				const now = new Date();
				const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
				const timeSinceUpdate = now.getTime() - updatedAt.getTime();
				const remainingTime = twentyFourHoursInMs - timeSinceUpdate;

				if (remainingTime > 0) {
					const remainingSeconds = Math.ceil(remainingTime / 1000);
					setTimeLeft(remainingSeconds);
					return remainingSeconds;
				} else {
					setTimeLeft(null);
					return 0;
				}
			} else {
				setTimeLeft(null);
				return 0;
			}
		};

		// Calculate initial time
		const initialTimeLeft = calculateTimeLeft();

		// Set up interval only if there's time remaining
		if (initialTimeLeft > 0) {
			interval = setInterval(() => {
				const newTimeLeft = calculateTimeLeft();
				if (newTimeLeft <= 0 && interval) {
					clearInterval(interval);
				}
			}, 1000);
		}

		// Cleanup function
		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [instructorData]);

	const handleSubmit = async (data: InstructorFormData) => {
			// Upload the CV file first using the new CV upload functionality
			const fileUrl = await uploadFile(
				data.cv,
				'profile',
				{
					userId: user?.id || '',
					contentType: 'cv'
				}
			);

			// Submit the form with the file URL
			await onSubmit({
				...data,
				cv: fileUrl,
			});
		
	};

	if (user?.role === "ADMIN") {
		return null;
	}

	// Show loading state while fetching instructor data
	if (isInstructorLoading) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="bg-white dark:bg-[#18181b] border-[#facc15]">
					<DialogHeader>
						<DialogTitle className="text-black dark:text-white text-xl font-semibold">
							Loading...
						</DialogTitle>
						<DialogDescription className="text-gray-600 dark:text-gray-300 mt-2">
							Checking your instructor application status...
						</DialogDescription>
					</DialogHeader>
					<div className="flex items-center justify-center py-8">
						<Loader2 className="h-8 w-8 animate-spin text-[#facc15]" />
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	if (instructorData?.data?.status === "PENDING") {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="bg-white dark:bg-[#18181b] border-[#facc15]">
					<DialogHeader>
						<DialogTitle className="text-black dark:text-white text-xl font-semibold">
							Application Pending
						</DialogTitle>
						<DialogDescription className="text-gray-600 dark:text-gray-300 mt-2">
							Your instructor application is currently under review. We will notify you once it has been processed.
						</DialogDescription>
					</DialogHeader>
					<div className="flex justify-end mt-6">
						<Button
							onClick={() => onOpenChange(false)}
							className="bg-[#facc15] text-black hover:bg-black hover:text-[#facc15] border-[#facc15] transition-colors"
						>
							Close
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	if (instructorData?.data?.status === "APPROVED") {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="bg-white dark:bg-[#18181b] border-[#facc15]">
					<DialogHeader>
						<DialogTitle className="text-black dark:text-white text-xl font-semibold">
							Application Approved
						</DialogTitle>
						<DialogDescription className="text-gray-600 dark:text-gray-300 mt-2">
							Your instructor application has been approved! Please log in again to be redirected to your instructor panel.
						</DialogDescription>
					</DialogHeader>
					<div className="flex justify-end mt-6">
						<Button
							onClick={() => onOpenChange(false)}
							className="bg-[#facc15] text-black hover:bg-black hover:text-[#facc15] border-[#facc15] transition-colors"
						>
							Close
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	if (instructorData?.data?.status === "DECLINED") {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="bg-white dark:bg-[#18181b] border-[#facc15]">
					<DialogHeader>
						<DialogTitle className="text-black dark:text-white text-xl font-semibold">
							Application Declined
						</DialogTitle>
						<DialogDescription className="text-gray-600 dark:text-gray-300 mt-2">
							{timeLeft ? (
								<span className="flex items-center gap-2">
									<Clock className="h-4 w-4 text-[#facc15]" />
									<span>
										You can submit a new application in {Math.floor(timeLeft / 3600)} hours and {Math.floor((timeLeft % 3600) / 60)} minutes.
									</span>
								</span>
							) : (
								"You can now submit a new application."
							)}
						</DialogDescription>
					</DialogHeader>
					<div className="flex justify-end mt-6">
						<Button
							onClick={() => onOpenChange(false)}
							className="bg-[#facc15] text-black hover:bg-black hover:text-[#facc15] border-[#facc15] transition-colors"
						>
							Close
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<FormModal
			open={open}
			onOpenChange={onOpenChange}
			onSubmit={handleSubmit}
			schema={instructorSchema}
			initialData={initialData as Partial<InstructorFormData>}
			title="Apply as Instructor"
			submitText="Submit Application"
			fields={fields}
			description="Fill out the form below to apply as an instructor."
			isSubmitting={isSubmitting || isInstructorLoading || isUploading}
		/>
	);
}
