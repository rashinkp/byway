import { getPublicUser } from "@/api/users";
import { PublicUser } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export const useGetPublicUser = (userId: string) => {
	return useQuery<PublicUser, Error>({
		queryKey: ["publicUser", userId],
		queryFn: () => getPublicUser(userId),
		enabled: !!userId,
		retry: 1,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};
