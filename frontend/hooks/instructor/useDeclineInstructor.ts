import { useMutation } from "@tanstack/react-query";
import { declineInstructor } from "@/api/instructor";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { queryClient } from "@/utils/queryClient";
import { ApiResponse } from "@/types/apiResponse";

export function useDeclineInstructor() {
  const { user } = useAuthStore();

  return useMutation<
    ApiResponse<{ id: string; status: string }>,
    Error,
    string
  >({
    mutationFn: (instructorId: string) => {
      if (user?.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required");
      }
      return declineInstructor(instructorId);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["instructors"] });
      queryClient.invalidateQueries({ queryKey: ["users"], exact: false });
      queryClient.invalidateQueries({ 
        queryKey: ["user-admin-details"],
        exact: false 
      });
      toast.success("Instructor declined successfully!", {
        description: `Instructor with ID ${response.data.id} has been declined.`,
      });
    },
    onError: (error) => {
      console.error("Instructor decline failed:", error.message);
      toast.error("Instructor Decline Failed", {
        description: error.message || "Something went wrong while declining",
      });
    },
  });
}
