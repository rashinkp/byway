import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Course, AddCourseParams } from "@/types/course";
import { createCourse } from "@/api/course";

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation<Course, Error, AddCourseParams>({
    mutationFn: createCourse,
    onMutate: async (newCourse) => {
      // Provide immediate feedback
      toast.loading("Creating course...", {
        description: `Adding "${newCourse.title}" to the system.`,
      });

      // Cancel any outgoing refetches to avoid overwriting optimistic updates
      await queryClient.cancelQueries({ queryKey: ["courses"] });

      // Snapshot the previous courses data
      const previousCourses = queryClient.getQueryData<Course[]>(["courses"]);

      // Optimistically update the courses list
      queryClient.setQueryData<Course[]>(["courses"], (old = []) => [
        ...old,
        {
          ...newCourse,
          id: "temp-id", // Temporary ID until server responds
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Course,
      ]);

      // Return context for rollback on error
      return { previousCourses };
    },
    onSuccess: (data) => {
      // Invalidate relevant queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", data.id] });

      // Show success toast with description
      toast.success("Course created successfully!", {
        description: `The course "${data.title}" has been added to your catalog.`,
      });
    },
    onError: (error, newCourse, context) => {
      // Show error toast with description
      toast.error("Failed to create course", {
        description:
          error.message ||
          `An error occurred while creating "${newCourse.title}". Please try again.`,
      });
    },
    onSettled: () => {
      // Dismiss the loading toast
      toast.dismiss();
    },
  });
}