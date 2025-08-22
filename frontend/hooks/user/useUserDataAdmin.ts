import { getUserDataById } from "@/api/users";
import { useQuery } from "@tanstack/react-query";
import { UseUserDataReturn } from "./useUserData";
import { User } from "@/types/user";

// Extend Error interface to include optional code property
interface ErrorWithCode extends Error {
	code?: string;
}

export function useUserDataById(userId: string): UseUserDataReturn {
	const { data, isLoading, error, refetch } = useQuery<User>({
		queryKey: ["userData", userId],
		queryFn: async () => {
			const userData = await getUserDataById(userId);
			return userData;
		},
		enabled: !!userId, // Only fetch if userId is provided
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
		data,
		isLoading,
		error: mappedError,
		refetch,
	};
}
