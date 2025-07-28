"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { useCurrentUserQuery } from "@/hooks/auth/useCurrentUserQuery";
import React from "react";
import { ThemeProvider } from "@/components/Theme-Provider";

function AuthHydrator() {
	const { data: user } = useCurrentUserQuery();
	const setUser = useAuthStore((s) => s.setUser);
	React.useEffect(() => {
		if (user) setUser(user);
	}, [user, setUser]);
	return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
	// Create a client
	const [queryClient] = useState(
		() =>
			new QueryClient({ 
				defaultOptions: {
					queries: {
						retry: 1,
						staleTime: 5 * 60 * 1000,
						refetchOnWindowFocus: false,
					},
				},
			}),
	);

	// Initialize auth on mount
	useEffect(() => {
		useAuthStore.getState().initializeAuth();
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<AuthHydrator />
			<ThemeProvider>{children}</ThemeProvider>
		</QueryClientProvider>
	);
}
