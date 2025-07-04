import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { logout } from "@/api/auth";
import { useAuthActions } from "./useAuthActions";

export function useLogout() {
	const { logoutUser } = useAuthActions();

	return useMutation({
		mutationFn: () => logout(),
		onSuccess: () => {
			logoutUser();
		},
		onError: (error: any) => {
			toast.error("Logout failed", {
				description: error.message || "Something went wrong",
			});
		},
	});
}
