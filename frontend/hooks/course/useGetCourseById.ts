"use client";

import { useQuery } from "@tanstack/react-query";
import { getCourseById } from "@/api/course";
import { Course } from "@/types/course";

export const useGetCourseById = (courseId: string) => {
	return useQuery<Course, Error>({
		queryKey: ["course", courseId],
		queryFn: () => getCourseById(courseId),
		enabled: !!courseId,
		retry: 1,
		staleTime: 5 * 60 * 1000,
	});
};
