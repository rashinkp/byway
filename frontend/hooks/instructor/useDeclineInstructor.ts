import { useMutation, useQueryClient } from "@tanstack/react-query";
import { declineInstructor } from "@/api/instructor";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { ApiResponse } from "@/types/general";
import { IInstructorWithUserDetails, IInstructorDetails } from "@/types/instructor";

export function useDeclineInstructor() {
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
			return declineInstructor(instructorId);
		},
		onSuccess: (response, instructorId) => {
			// Update instructor listing cache
			queryClient.setQueriesData(
				{ queryKey: ["instructors"] },
				(oldData: { data: { items: IInstructorWithUserDetails[] } } | undefined) => {
					if (!oldData?.data?.items) return oldData;
					
					return {
						...oldData,
						data: {
							...oldData.data,
							items: oldData.data.items.map((instructor: IInstructorWithUserDetails) =>
								instructor.id === instructorId
									? {
											...instructor,
											status: "DECLINED",
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
							status: "DECLINED",
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
							status: "DECLINED",
						},
					};
				}
			);

			toast.success("Instructor declined successfully!", {
				description: `Instructor with ID ${response.data.id} has been declined.`,
			});
		},
		onError: (error) => {
			console.error("Instructor decline failed:", error.message);
			toast.error("Instructor Decline Failed", {
				description: error.message || "Something went wrong while declining",
			});
		},
	});
}
