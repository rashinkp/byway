import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { logout } from "@/api/auth";
import { useAuthStore } from "@/stores/auth.store";

export function useLogout() {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      clearAuth(); // Clear store and localStorage
      queryClient.invalidateQueries({ queryKey: ["auth"] }); // Invalidate auth queries
      toast.success("Logged out successfully");
    },
    onError: (error: any) => {
      toast.error("Logout failed", {
        description: error.message || "Something went wrong",
      });
    },
  });
}
