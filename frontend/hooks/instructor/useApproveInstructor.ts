import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveInstructor } from "@/api/instructor";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { ApiResponse } from "@/types/general";
import { IInstructorWithUserDetails, IInstructorDetails } from "@/types/instructor";

export function useApproveInstructor() {
	const { user } = useAuthStore();
	const queryClient = useQueryClient();

	return useMutation<
		ApiResponse<{ id: string; status: string }>,
		Error,
		string
	>({
		mutationFn: (instructorId: string) => {
			if (user?.role !== "ADMIN") {
				throw new Error("Unauthorized: Admin access required");
			}
			return approveInstructor(instructorId);
		},
		onSuccess: (response, instructorId) => {
			// Update instructor listing cache
			queryClient.setQueriesData(
				{ queryKey: ["instructors"] },
				(oldData: any) => {
					if (!oldData?.data?.items) return oldData;
					
					return {
						...oldData,
						data: {
							...oldData.data,
							items: oldData.data.items.map((instructor: IInstructorWithUserDetails) =>
								instructor.id === instructorId
									? {
											...instructor,
											status: "APPROVED",
										}
									: instructor
							),
						},
					};
				}
			);

			// Update instructor details cache
			queryClient.setQueriesData(
				{ queryKey: ["instructorDetails"] },
				(oldData: ApiResponse<IInstructorDetails> | undefined) => {
					if (!oldData?.data || oldData.data.instructorId !== instructorId) return oldData;
					
					return {
						...oldData,
						data: {
							...oldData.data,
							status: "APPROVED",
						},
					};
				}
			);

			// Update instructor query cache
			queryClient.setQueriesData(
				{ queryKey: ["instructor"] },
				(oldData: ApiResponse<IInstructorWithUserDetails | null> | undefined) => {
					if (!oldData?.data || oldData.data.id !== instructorId) return oldData;
					
					return {
						...oldData,
						data: {
							...oldData.data,
							status: "APPROVED",
						},
					};
				}
			);

			toast.success("Instructor approved successfully!", {
				description: `Instructor with ID ${response.data.id} has been approved.`,
			});
		},
		onError: (error) => {
			console.error("Instructor approval failed:", error.message);
			toast.error("Instructor Approval Failed", {
				description: error.message || "Something went wrong while approving",
			});
		},
	});
}
