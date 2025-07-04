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
import { Loader2, Info } from "lucide-react";
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
				<Button
					variant="outline"
					className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
				>
					Review Pending Instructors
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[625px] z-50">
				<DialogHeader>
					<DialogTitle>Pending Instructor Approvals</DialogTitle>
				</DialogHeader>
				<div className="mt-4">
					{isLoading ? (
						<div className="flex justify-center py-4">
							<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
						</div>
					) : pendingInstructors.length === 0 ? (
						<div className="text-center py-4 text-gray-500">
							No pending instructor approvals
						</div>
					) : (
						<div className="space-y-4 max-h-[60vh] overflow-y-auto">
							{pendingInstructors.map(
								(instructor: IInstructorWithUserDetails) => (
									<div
										key={instructor.id}
										className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm"
									>
										<div className="flex-1">
											<p className="font-medium text-gray-800 text-lg">
												{instructor.user.name || "Unnamed Instructor"}
											</p>
											<p className="text-sm font-semibold text-blue-600">
												{instructor.areaOfExpertise}
											</p>
											<p className="text-sm text-gray-500 mt-1">
												{instructor.professionalExperience}
											</p>
											<div className="mt-2 text-sm text-gray-600">
												<p>Email: {instructor.user.email}</p>
												<p>
													Joined:{" "}
													{new Date(
														instructor.user.createdAt,
													).toLocaleDateString()}
												</p>
											</div>
										</div>
										<div className="flex flex-col space-y-2 ml-4">
											<Button
												variant="outline"
												size="sm"
												className="w-full"
												onClick={() => handleViewDetails(instructor.user.id)}
											>
												<Info className="h-4 w-4 mr-2" />
												View Details
											</Button>
											<Button
												variant="default"
												size="sm"
												className="bg-green-600 hover:bg-green-700 text-white w-full"
												onClick={() => handleApprove(instructor.id)}
											>
												Approve
											</Button>
											<Button
												variant="destructive"
												size="sm"
												className="bg-red-600 hover:bg-red-700 text-white w-full"
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
