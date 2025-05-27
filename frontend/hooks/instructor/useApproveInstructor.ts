import { useMutation } from "@tanstack/react-query";
import { approveInstructor } from "@/api/instructor";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { queryClient } from "@/utils/queryClient";
import { ApiResponse } from "@/types/apiResponse";

export function useApproveInstructor() {
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
      return approveInstructor(instructorId);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["instructors"] });
      queryClient.invalidateQueries({ queryKey: ["users"], exact: false });
      queryClient.invalidateQueries({ 
        queryKey: ["user-admin-details"],
        exact: false 
      });
      toast.success("Instructor approved successfully!", {
        description: `Instructor with ID ${response.data.id} has been approved.`,
      });
    },
    onError: (error) => {
      console.error("Instructor approval failed:", error.message);
      toast.error("Instructor Approval Failed", {
        description: error.message || "Something went wrong while approving",
      });
    },
  });
}
