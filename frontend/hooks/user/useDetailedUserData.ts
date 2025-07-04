"use client";

import { getDetailedUserData } from "@/api/users";
import { UserProfileType } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export function useDetailedUserData() {
	return useQuery<UserProfileType>({
		queryKey: ["detailedUserData"],
		queryFn: getDetailedUserData,
	});
}
