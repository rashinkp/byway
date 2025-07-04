"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleDeleteUser } from "@/api/users";

export function useToggleDeleteUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			await toggleDeleteUser(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			queryClient.invalidateQueries({ queryKey: ["user-admin-details"] });
			toast.success("User status updated successfully");
		},
		onError: (error: any) => {
			toast.error("Failed to update user status", {
				description: error.message || "Please try again",
			});
		},
	});
}
