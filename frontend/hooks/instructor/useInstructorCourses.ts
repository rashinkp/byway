import { getInstructorCourses } from "@/api/instructor";
import { InstructorCourse } from "@/types/instructor";
import { useQuery } from "@tanstack/react-query";

export function useInstructorCourses() {
	return useQuery<InstructorCourse[]>({
		queryKey: ["instructor-courses"],
		queryFn: async () => {
			const response = await getInstructorCourses();
			return response;
		},
	});
}
