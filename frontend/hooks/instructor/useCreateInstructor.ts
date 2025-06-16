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
      queryClient.invalidateQueries({ queryKey: ["user"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["instructor"], exact: false });
      toast.success("Instructor application submitted successfully!", {
        description: "Your application is under review.",
      });
    },
    onError: (error) => {
      console.error(
        "Instructor creation failed:",
        JSON.stringify(error, null, 2)
      );
      
      // Handle different error types
      let errorMessage = "Something went wrong while applying";
      
      if (error?.response?.status === 404) {
        errorMessage = "User not found. Please try logging in again.";
      } else if (error?.response?.status === 400) {
        errorMessage = error?.response?.data?.message || "Invalid application data";
      } else if (error?.response?.status === 403) {
        errorMessage = "You are not authorized to perform this action";
      } else if (error?.response?.status === 409) {
        errorMessage = "You already have a pending application";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error("Instructor Apply Failed", {
        description: errorMessage,
      });
    },
  });
}
