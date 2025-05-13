import { useMutation } from "@tanstack/react-query";
import { createInstructor } from "@/api/instructor";
import { InstructorFormData } from "@/types/instructor";
import { useAuthStore } from "@/stores/auth.store";
import { User } from "@/types/user";
import { toast } from "sonner";
import { queryClient } from "@/utils/queryClient";
import { ApiResponse } from "@/types/apiResponse";

export function useCreateInstructor() {
  const { setUser } = useAuthStore();

  return useMutation<
    ApiResponse<User>,
    Error,
    InstructorFormData
  >({
    mutationFn: (characters: InstructorFormData) =>
      createInstructor(characters),
    onSuccess: (response) => {
      setUser(response.data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Instructor application submitted successfully!", {
        description: "Your application is under review.",
      });
    },
    onError: (error) => {
      console.error("Instructor creation failed:", error.message);
      toast.error("Instructor Apply Failed", {
        description: error.message || "Something went wrong while applying",
      });
    },
  });
}
