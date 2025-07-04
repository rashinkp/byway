"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProgress } from "@/api/progress";
import { IProgress, IUpdateProgressInput } from "@/types/progress";
import { toast } from "sonner";

interface UseUpdateProgressReturn {
	mutate: (data: IUpdateProgressInput) => void;
	isLoading: boolean;
	error: { message: string } | null;
}

export function useUpdateProgress(): UseUpdateProgressReturn {
	const queryClient = useQueryClient();

	const { mutate, isPending, error } = useMutation<
		IProgress,
		Error,
		IUpdateProgressInput
	>({
		mutationFn: updateProgress,
		onSuccess: (data) => {
			// Invalidate the progress query to refetch the updated progress
			queryClient.invalidateQueries({
				queryKey: ["progress", data.courseId],
			});
			toast.success("Progress Updated", {
				description: "Your course progress has been updated successfully.",
			});
		},
		onError: (error) => {
			toast.error("Error", {
				description:
					error instanceof Error
						? error.message
						: "An unexpected error occurred while updating progress.",
			});
		},
	});

	const mappedError = error
		? {
				message:
					error instanceof Error
						? error.message
						: "An unexpected error occurred",
			}
		: null;

	return {
		mutate,
		isLoading: isPending,
		error: mappedError,
	};
}
