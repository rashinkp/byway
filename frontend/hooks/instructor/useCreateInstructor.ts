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

  return useMutation<ApiResponse<User>, any, InstructorFormData>({
    mutationFn: (data: InstructorFormData) => createInstructor(data),
    onSuccess: (response) => {
      setUser(response.data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Instructor application submitted successfully!", {
        description: "Your application is under review.",
      });
    },
    onError: (error) => {
      console.error(
        "Instructor creation failed:",
        JSON.stringify(error, null, 2)
      );
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong while applying";
      toast.error("Instructor Apply Failed", {
        description: errorMessage,
      });
    },
  });
}
