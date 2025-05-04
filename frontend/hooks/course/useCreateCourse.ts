import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Course, AddCourseParams } from "@/types/course";
import { createCourse } from "@/api/course";

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation<Course, Error, AddCourseParams>({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create course", {
        description: error.message || "Something went wrong",
      });
    },
  });
}
