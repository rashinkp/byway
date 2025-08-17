import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { QueryClient } from "@tanstack/react-query";

// Extend Window interface to include React Query client
declare global {
	interface Window {
		__REACT_QUERY_CLIENT__?: QueryClient;
	}
}

export function formatDate(date: string) {
	return new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Utility function to clear all React Query cache
export const clearAllCache = () => {
	if (typeof window !== "undefined") {
		// Try to access the query client from the window object
		const queryClient = window.__REACT_QUERY_CLIENT__;
		if (queryClient && typeof queryClient.clear === "function") {
			queryClient.clear();
		}
	}
};
