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
	handleAuthError: (error: { message: string; statusCode?: number }) => void;
}

// Helper functions for localStorage
const USER_STORAGE_KEY = "auth_user";
const EMAIL_STORAGE_KEY = "auth_email";

const saveUserToStorage = (user: User | null) => {
	if (typeof window !== "undefined") {
		if (user) {
			localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
		} else {
			localStorage.removeItem(USER_STORAGE_KEY);
		}
	}
};

const loadUserFromStorage = (): User | null => {
	if (typeof window !== "undefined") {
		try {
			const stored = localStorage.getItem(USER_STORAGE_KEY);
			if (stored) {
				const user = JSON.parse(stored);
				return user;
			}
		} catch {
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
		

		
		set({ user, isInitialized: true, isLoading: false });
	},
	setEmail: (email) => {
		saveEmailToStorage(email);
		set({ email });
	},
	clearAuth: () => {
		clearAllCache();
		saveUserToStorage(null);
		saveEmailToStorage(null);
		if (typeof window !== "undefined") {
			localStorage.removeItem("auth_user");
			localStorage.removeItem("auth_email");
		}
		set({
			user: null,
			isInitialized: true, // Keep initialized to avoid re-fetching
			isLoading: false,
			email: null,
		});
	},
	handleAuthError: (error: { message: string; statusCode?: number }) => {
		if (error?.statusCode === 401 || error?.statusCode === 401) {
			get().clearAuth();
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
