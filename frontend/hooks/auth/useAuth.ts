import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";

export function useAuth() {
	const { user, isLoading, isInitialized, initializeAuth } = useAuthStore();

	useEffect(() => {
		if (!isInitialized) {
			initializeAuth();
		}
	}, [isInitialized, initializeAuth]);

	return {
		user,
		isLoading,
		isAuthenticated: !!user,
	};
}
