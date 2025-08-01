"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleDeleteUser } from "@/api/users";
import { User } from "@/types/user";
import { IInstructorWithUserDetails, IInstructorDetails } from "@/types/instructor";
import { ApiResponse, IPaginatedResponse } from "@/types/general";

export function useToggleDeleteUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			await toggleDeleteUser(id);
		},
		onSuccess: (_, userId) => {
			const newDeletedAt = new Date().toISOString();

			// Update all users queries in the cache
			queryClient.setQueriesData(
				{ queryKey: ["users"] },
				(oldData: ApiResponse<IPaginatedResponse<User>> | undefined) => {
					if (!oldData?.data?.items) return oldData;
					
					return {
						...oldData,
						data: {
							...oldData.data,
							items: oldData.data.items.map((user: User) =>
								user.id === userId
									? {
											...user,
											deletedAt: user.deletedAt ? null : newDeletedAt,
										}
									: user
							),
						},
					};
				}
			);

			// Update user-admin-details query if it exists
			queryClient.setQueriesData(
				{ queryKey: ["user-admin-details", userId] },
				(oldData: ApiResponse<User> | undefined) => {
					if (!oldData?.data) return oldData;
					
					return {
						...oldData,
						data: {
							...oldData.data,
							deletedAt: oldData.data.deletedAt ? null : newDeletedAt,
						},
					};
				}
			);

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
								instructor.userId === userId
									? {
											...instructor,
											user: {
												...instructor.user,
												deletedAt: instructor.user.deletedAt ? null : newDeletedAt,
											},
										}
									: instructor
							),
						},
					};
				}
			);

			// Update instructor details cache - this was causing the refetch
			queryClient.setQueriesData(
				{ queryKey: ["instructorDetails", userId] },
				(oldData: ApiResponse<IInstructorDetails> | undefined) => {
					if (!oldData?.data) return oldData;
					
					return {
						...oldData,
						data: {
							...oldData.data,
							deletedAt: oldData.data.deletedAt ? null : newDeletedAt,
						},
					};
				}
			);

			// Update instructor query cache
			queryClient.setQueriesData(
				{ queryKey: ["instructor", userId] },
				(oldData: ApiResponse<IInstructorWithUserDetails | null> | undefined) => {
					if (!oldData?.data) return oldData;
					
					return {
						...oldData,
						data: oldData.data ? {
							...oldData.data,
							user: {
								...oldData.data.user,
								deletedAt: oldData.data.user.deletedAt ? null : newDeletedAt,
							},
						} : null,
					};
				}
			);

			toast.success("User status updated successfully");
		},
		onError: (error) => {
			toast.error("Failed to update user status", {
				description: error.message || "Please try again",
			});
		},
	});
}
