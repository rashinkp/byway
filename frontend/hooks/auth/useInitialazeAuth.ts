"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";

export function useInitializeAuth() {
	const { isInitialized, initializeAuth } = useAuthStore();

	useEffect(() => {
		if (!isInitialized) {
			initializeAuth();
		}
	}, [isInitialized, initializeAuth]);
}
