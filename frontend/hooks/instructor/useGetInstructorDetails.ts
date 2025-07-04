import { useQuery } from "@tanstack/react-query";
import { getInstructorDetails } from "@/api/instructor";
import { IInstructorDetails } from "@/types/instructor";
import { ApiResponse } from "@/types/apiResponse";

export function useGetInstructorDetails(
	userId: string,
	enabled: boolean = true,
) {
	const queryResult = useQuery<ApiResponse<IInstructorDetails>, Error>({
		queryKey: ["instructorDetails", userId],
		queryFn: () => getInstructorDetails(userId),
		enabled: !!userId && enabled,
	});

	return queryResult;
}
