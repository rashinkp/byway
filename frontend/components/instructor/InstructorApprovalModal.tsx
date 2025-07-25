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
import { useApproveInstructor } from "@/hooks/instructor/useApproveInstructor";
import { useDeclineInstructor } from "@/hooks/instructor/useDeclineInstructor";
import { IInstructorWithUserDetails } from "@/types/instructor";
import { Loader2, Info, Clock } from "lucide-react";
import { useGetAllInstructors } from "@/hooks/instructor/useGetAllInstructor";
import { useRouter } from "next/navigation";

export function InstructorApprovalModal() {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	const { data, isLoading, refetch } = useGetAllInstructors();
	const { mutate: approveInstructor } = useApproveInstructor();
	const { mutate: declineInstructor } = useDeclineInstructor();

	const pendingInstructors =
		data?.data?.items?.filter(
			(item: IInstructorWithUserDetails) => item.status === "PENDING",
		) || [];

	const handleApprove = (instructorId: string) => {
		approveInstructor(instructorId, {
			onSuccess: () => {
				refetch();
			},
		});
	};

	const handleDecline = (instructorId: string) => {
		declineInstructor(instructorId, {
			onSuccess: () => {
				refetch();
			},
		});
	};

	const handleViewDetails = (instructorId: string) => {
		router.push(`/admin/instructors/${instructorId}`);
		setIsOpen(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button  className="text-[#facc15] border-[#facc15] bg-white dark:bg-[#232326] hover:bg-[#facc15]/10">
					<Clock className="w-4 h-4 mr-2 text-[#facc15]" />
					Pending Instructors
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-2xl bg-white/80 dark:bg-[#232326] border border-gray-200 dark:border-gray-700 shadow-lg">
				<DialogHeader>
					<DialogTitle className="text-lg font-bold text-[#facc15] dark:text-[#facc15]">Pending Instructor Approvals</DialogTitle>
				</DialogHeader>
				<div className="space-y-6">
					{isLoading ? (
						<div className="flex items-center justify-center py-8">
							<Loader2 className="w-8 h-8 animate-spin text-[#facc15]" />
						</div>
					) : pendingInstructors.length === 0 ? (
						<div className="text-gray-500 dark:text-gray-300 text-center py-8">No pending instructors.</div>
					) : (
						<div className="space-y-4">
							{pendingInstructors.map(
								(instructor: IInstructorWithUserDetails) => (
									<div
										key={instructor.id}
										className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white/80 dark:bg-[#232326] shadow-sm"
									>
										<div className="flex-1">
											<p className="font-medium text-black dark:text-white text-lg">
												{instructor.user.name || "Unnamed Instructor"}
											</p>
											<p className="text-sm font-semibold text-[#facc15] dark:text-[#facc15]">
												{instructor.areaOfExpertise}
											</p>
											<p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
												{instructor.professionalExperience}
											</p>
											<div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
												<p>Email: {instructor.user.email}</p>
												<p>
													Joined: {new Date(
														instructor.user.createdAt,
													).toLocaleDateString()}
												</p>
											</div>
										</div>
										<div className="flex flex-col space-y-2 ml-4">
											<Button
												size="sm"
												className="w-full border-[#facc15] text-[#facc15] bg-white dark:bg-[#232326] hover:bg-[#facc15]/10"
												onClick={() => handleViewDetails(instructor.user.id)}
											>
												<Info className="h-4 w-4 mr-2 text-[#facc15]" />
												View Details
											</Button>
											<Button
												variant="default"
												size="sm"
												className="bg-[#facc15] hover:bg-yellow-400 text-black dark:bg-[#facc15] dark:hover:bg-yellow-400 dark:text-[#18181b] w-full font-semibold"
												onClick={() => handleApprove(instructor.id)}
											>
												Approve
											</Button>
											<Button
												variant="secondary"
												size="sm"
												className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-0 hover:bg-red-200 dark:hover:bg-red-900/60 w-full font-semibold"
												onClick={() => handleDecline(instructor.id)}
											>
												Decline
											</Button>
										</div>
									</div>
								),
							)}
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
