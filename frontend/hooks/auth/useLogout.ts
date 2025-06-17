import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { logout } from "@/api/auth";
import { useAuthStore } from "@/stores/auth.store";
import { clearAllCache } from "@/lib/utils";

export function useLogout() {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      // Clear all cache to ensure fresh data for logged-out state
      queryClient.clear();
      clearAllCache();
      
      clearAuth(); // Clear store and localStorage
      toast.success("Logged out successfully");
    },
    onError: (error: any) => {
      toast.error("Logout failed", {
        description: error.message || "Something went wrong",
      });
    },
  });
}
