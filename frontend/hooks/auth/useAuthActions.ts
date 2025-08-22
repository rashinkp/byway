import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { clearAllCache } from "@/lib/utils";
import { User } from "@/types/user";

export function useAuthActions() {
	const queryClient = useQueryClient();
	const { setUser, clearAuth } = useAuthStore();

	const loginUser = (user: User) => {
		// Clear all cache to ensure fresh data for the logged-in user
		queryClient.clear();
		clearAllCache();
		setUser(user);
	};

	const logoutUser = () => {
		// Clear all cache to ensure fresh data for logged-out state
		queryClient.clear();
		clearAllCache();
		clearAuth();
	};

	return {
		loginUser,
		logoutUser,
	};
}
