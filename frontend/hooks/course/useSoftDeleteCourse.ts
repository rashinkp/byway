"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Course } from "@/types/course";
import { deleteCourse } from "@/api/course";

export function useSoftDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (course: Course) => {
      await deleteCourse(course.id);
      return course; // Return the course for consistent handling
    },
    onMutate: async (course: Course) => {
      await queryClient.cancelQueries({ queryKey: ["courses", 1, 10, ""] });

      const previousCourses = queryClient.getQueryData<{
        data: Course[];
        total: number;
        page: number;
        limit: number;
      }>(["courses", 1, 10, ""]);

      queryClient.setQueryData(["courses", 1, 10, ""], (old: any) => ({
        data: old?.data.filter((c: Course) => c.id !== course.id) ?? [],
        total: (old?.total ?? 1) - 1,
        page: old?.page || 1,
        limit: old?.limit || 10,
      }));

      return { previousCourses };
    },
    onSuccess: (deletedCourse: Course) => {
      toast.success(
        `Successfully ${!deletedCourse.deletedAt ? "Disabled" : "Enabled"} course "`,
        {
          description: `Course "${deletedCourse.title}" ${
            !deletedCourse.deletedAt ? "Disabled" : "Enabled"
          } successfully`,
        }
      );
    },
    onError: (error: any, course: Course, context: any) => {
      queryClient.setQueryData(
        ["courses", 1, 10, ""],
        context?.previousCourses
      );
      toast.error(`Failed to delete course "${course.title}"`, {
        description: error.message || "Please try again",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}
