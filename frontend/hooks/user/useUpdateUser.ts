"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User, transformUserData } from "@/types/user";
import { updateUser } from "@/api/users";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth.store";

// Extend Error interface to include optional code property
interface ErrorWithCode extends Error {
	code?: string;
}

interface UseUpdateUserReturn {
	mutate: (data: {
		name?: string;
		avatar?: string;
		bio?: string;
		education?: string;
		skills?: string;
		phoneNumber?: string;
		country?: string;
		city?: string;
		address?: string;
		dateOfBirth?: string;
		gender?: "MALE" | "FEMALE" | "OTHER";
	}) => void;
	mutateAsync: (data: {
		name?: string;
		avatar?: string;
		bio?: string;
		education?: string;
		skills?: string;
		phoneNumber?: string;
		country?: string;
		city?: string;
		address?: string;
		dateOfBirth?: string;
		gender?: "MALE" | "FEMALE" | "OTHER";
	}) => Promise<User>;
	isLoading: boolean;
	error: { message: string; code?: string } | null;
}

export function useUpdateUser(): UseUpdateUserReturn {
	const queryClient = useQueryClient();
	const { user, setUser } = useAuthStore();

	const { mutate, mutateAsync, isPending, error } = useMutation<
		User,
		Error,
		{
			name?: string;
			avatar?: string;
			bio?: string;
			education?: string;
			skills?: string;
			phoneNumber?: string;
			country?: string;
			city?: string;
			address?: string;
			dateOfBirth?: string;
			gender?: "MALE" | "FEMALE" | "OTHER";
		}
	>({
		mutationFn: updateUser,
		onSuccess: (updatedUser) => {
			// Safety check: ensure updatedUser exists
			if (!updatedUser) {
				toast.error("Error", {
					description: "Failed to update profile. Please try again.",
				});
				return;
			}

			// Update the auth store with the new user data
			setUser(updatedUser);
			
			// Update React Query cache directly instead of invalidating
			queryClient.setQueryData(["userData", user?.id], updatedUser);
			
			// Transform User to UserProfileType for detailedUserData cache
			const transformedUserData = transformUserData(updatedUser);
			queryClient.setQueryData(["detailedUserData", user?.id], transformedUserData);
			
			toast.success("Success", {
				description: "Your profile has been updated successfully.",
			});
		},
		onError: (error) => {
			toast.error("Error", {
				description:
					error instanceof Error
						? error.message
						: "An unexpected error occurred while updating your profile.",
			});
		},
	});

	const mappedError = error
		? {
				message:
					error instanceof Error
						? error.message
						: "An unexpected error occurred",
				code:
					error instanceof Error && "code" in error
						? (error as ErrorWithCode).code
						: undefined,
			}
		: null;

	return {
		mutate,
		mutateAsync,
		isLoading: isPending,
		error: mappedError,
	};
}
