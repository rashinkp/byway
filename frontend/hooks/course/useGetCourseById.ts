'use client'

import { useQuery } from "@tanstack/react-query";
import { getCourseById } from "@/api/course";
import { Course } from "@/types/course";
import { useAuthStore } from "@/stores/auth.store";

export const useGetCourseById = (courseId: string) => {
  const { user } = useAuthStore();

  return useQuery<Course, Error>({
    queryKey: ["course", courseId],
    queryFn: () => getCourseById(courseId),
    enabled: !!courseId,
    retry: 1,
    staleTime: 5 * 60 * 1000, 
  });
};
