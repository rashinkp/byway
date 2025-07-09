import { create } from "zustand";
import { User } from "@/types/user";
import { clearAllCache } from "@/lib/utils";

interface AuthState {
	user: User | null;
	isInitialized: boolean;
	isLoading: boolean;
	email: string | null;
	isHydrating: boolean;
	setUser: (user: User | null) => void;
	setEmail: (email: string) => void;
	clearAuth: () => void;
	initializeAuth: () => Promise<void>;
	handleAuthError: (error: any) => void;
}

// Helper functions for localStorage
const USER_STORAGE_KEY = "auth_user";
const EMAIL_STORAGE_KEY = "auth_email";

const saveUserToStorage = (user: User | null) => {
	if (typeof window !== "undefined") {
		if (user) {
			console.log("[AuthStore] Setting auth_user in localStorage:", user);
			localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
			console.log("AuthStore: Saved user to localStorage:", user.role);
		} else {
			console.log("[AuthStore] Removing auth_user from localStorage");
			localStorage.removeItem(USER_STORAGE_KEY);
			console.log("AuthStore: Removed user from localStorage");
		}
	}
};

const loadUserFromStorage = (): User | null => {
	if (typeof window !== "undefined") {
		try {
			const stored = localStorage.getItem(USER_STORAGE_KEY);
			if (stored) {
				const user = JSON.parse(stored);
				console.log("AuthStore: Loaded user from localStorage:", user.role);
				return user;
			}
		} catch (error) {
			console.error("Error loading user from localStorage:", error);
			return null;
		}
	}
	return null;
};

const saveEmailToStorage = (email: string | null) => {
	if (typeof window !== "undefined") {
		if (email) {
			localStorage.setItem(EMAIL_STORAGE_KEY, email);
		} else {
			localStorage.removeItem(EMAIL_STORAGE_KEY);
		}
	}
};

const loadEmailFromStorage = (): string | null => {
	if (typeof window !== "undefined") {
		return localStorage.getItem(EMAIL_STORAGE_KEY);
	}
	return null;
};

export const useAuthStore = create<AuthState>((set, get) => ({
	user: null,
	isInitialized: false,
	isLoading: true,
	email: null,
	isHydrating: false,
	setUser: (user) => {
		const currentUser = get().user;
		const userIdChanged = currentUser?.id !== user?.id;
		
		// Save to localStorage
		saveUserToStorage(user);
		
		// Clear cache when user state changes
		clearAllCache();
		
		// If user ID changed, clear React Query cache for user-specific queries
		if (userIdChanged && typeof window !== "undefined") {
			console.log("AuthStore: User ID changed, clearing React Query cache");
			// This will be handled by the clearAllCache function
		}
		
		set({ user, isInitialized: true, isLoading: false });
		console.log("AuthStore: User set:", user?.role || "null", "ID:", user?.id);
	},
	setEmail: (email) => {
		saveEmailToStorage(email);
		set({ email });
	},
	clearAuth: () => {
		console.log("[AuthStore] clearAuth called");
		clearAllCache();
		saveUserToStorage(null);
		saveEmailToStorage(null);
		if (typeof window !== "undefined") {
			localStorage.removeItem("auth_user");
			localStorage.removeItem("auth_email");
			console.log("[AuthStore] Cleared auth_user and auth_email from localStorage");
		}
		set({
			user: null,
			isInitialized: true, // Keep initialized to avoid re-fetching
			isLoading: false,
			email: null,
		});
		console.log("AuthStore: Auth cleared");
	},
	handleAuthError: (error: any) => {
		if (error?.status === 401 || error?.response?.status === 401) {
			console.log("Unauthorized error detected, clearing auth");
			get().clearAuth();
		} else {
			console.log("Non-unauthorized error, keeping user data:", error?.status || error?.response?.status);
		}
	},
	initializeAuth: async () => {
		if (get().isInitialized) {
			return;
		}
		set({ isLoading: true, isHydrating: true });

		const storedEmail = loadEmailFromStorage();
		if (storedEmail) set({ email: storedEmail });

		const storedUser = loadUserFromStorage();
		if (storedUser && storedUser.id && storedUser.role) {
			set({
				user: storedUser,
				isInitialized: true,
				isLoading: false,
				isHydrating: false,
			});
			return;
		}

		// No backend fetch here; React Query will handle it
		set({
			isInitialized: true,
			isLoading: false,
			isHydrating: false,
		});
	},
}));
