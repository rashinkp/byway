import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Course } from "@/types/course";
import { createCourse } from "@/api/course";

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation<
    Course,
    Error,
    {
      title: string;
      description?: string | null;
      categoryId: string;
      price?: number | null;
      duration?: number | null;
      level?: "BEGINNER" | "MEDIUM" | "ADVANCED";
      thumbnail?: string | null;
      offer?: number | null;
      status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
      details?: {
        prerequisites?: string | null;
        longDescription?: string | null;
        objectives?: string | null;
        targetAudience?: string | null;
      } | null;
    }
  >({
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
