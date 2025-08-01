"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleDeleteUser } from "@/api/users";
import { User } from "@/types/user";
import { ApiResponse, IPaginatedResponse } from "@/types/general";

export function useToggleDeleteUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			await toggleDeleteUser(id);
		},
		onSuccess: (_, userId) => {
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
											deletedAt: user.deletedAt ? null : new Date().toISOString(),
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
							deletedAt: oldData.data.deletedAt ? null : new Date().toISOString(),
						},
					};
				}
			);

			toast.success("User status updated successfully");
		},
		onError: (error: any) => {
			toast.error("Failed to update user status", {
				description: error.message || "Please try again",
			});
		},
	});
}
