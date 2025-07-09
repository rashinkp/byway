import { useQuery } from "@tanstack/react-query";
import { getInstructorCourses } from "@/api/instructor.api";
import { InstructorCourse } from "@/types/instructor.types";

export function useInstructorCourses() {
	return useQuery<InstructorCourse[]>({
		queryKey: ["instructor-courses"],
		queryFn: async () => {
			const response = await getInstructorCourses();
			return response;
		},
	});
}
