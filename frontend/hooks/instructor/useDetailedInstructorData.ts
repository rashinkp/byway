import { useQuery } from "@tanstack/react-query";
import { getInstructorProfile } from "@/api/instructor.api";
import { useAuth } from "../auth/useAuth";

export function useDetailedInstructorData() {
	const { user } = useAuth();

	return useQuery({
		queryKey: ["instructor", user?.id],
		queryFn: async () => {
			if (!user?.id) throw new Error("User not authenticated");
			const response = await getInstructorProfile(user.id);
			return response.data;
		},
		enabled: !!user?.id,
	});
}
