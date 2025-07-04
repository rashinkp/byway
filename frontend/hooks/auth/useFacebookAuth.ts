import { facebookAuth } from "@/api/auth";
import { useState, useEffect } from "react";
import { useRoleRedirect } from "../useRoleRedirects";
import { useAuthStore } from "@/stores/auth.store";
import { clearAllCache } from "@/lib/utils";

declare global {
	interface Window {
		fbAsyncInit?: () => void;
		FB: any;
	}
}

interface FacebookUserData {
	id: string;
	name: string;
	email?: string;
	picture?: {
		data: {
			url: string;
		};
	};
	error?: any;
}

interface AuthResponse {
	accessToken: string;
	userID: string;
	expiresIn: number;
	signedRequest: string;
	graphDomain: string;
	data_access_expiration_time: number;
}

interface UseFacebookAuthResult {
	login: () => void;
	isLoading: boolean;
	error: string | null;
	isAuthenticated: boolean;
}

export function useFacebookAuth(): UseFacebookAuthResult {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const { setUser } = useAuthStore();
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	const { redirectByRole } = useRoleRedirect();

	// Initialize Facebook SDK
	useEffect(() => {
		window.fbAsyncInit = () => {
			window.FB.init({
				appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
				cookie: true,
				xfbml: true,
				version: "v21.0",
			});
		};

		(function (d, s, id) {
			const fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			const js = d.createElement(s) as HTMLScriptElement;
			js.id = id;
			js.src = "https://connect.facebook.net/en_US/sdk.js";
			fjs.parentNode?.insertBefore(js, fjs);
		})(document, "script", "facebook-jssdk");

		return () => {
			delete window.fbAsyncInit;
		};
	}, []);

	const login = async () => {
		setIsLoading(true);
		setError(null);

		try {
			if (!window.FB) {
				throw new Error("Facebook SDK not loaded");
			}

			const loginResponse = await new Promise<AuthResponse>(
				(resolve, reject) => {
					window.FB.login(
						(response: { authResponse: AuthResponse | undefined }) => {
							if (response.authResponse) {
								resolve(response.authResponse);
							} else {
								reject(
									new Error("User cancelled login or did not fully authorize."),
								);
							}
						},
						{ scope: "public_profile,email" },
					);
				},
			);

			const userData = await new Promise<FacebookUserData>(
				(resolve, reject) => {
					window.FB.api(
						"/me",
						{ fields: "id,name,email,picture" },
						(response: FacebookUserData) => {
							if (response && !response.error) {
								resolve(response);
							} else {
								reject(new Error("Failed to fetch user data"));
							}
						},
					);
				},
			);

			const backendResponse = await facebookAuth({
				accessToken: loginResponse.accessToken,
				userId: userData.id,
				name: userData.name,
				email: userData.email,
				picture: userData.picture?.data.url,
			});

			console.log(backendResponse.data);

			// Clear all cache to ensure fresh data for the logged-in user
			clearAllCache();

			setUser(backendResponse.data);
			setIsAuthenticated(true);
			setIsLoading(false);
			redirectByRole(backendResponse.data.role || "/");
		} catch (err: any) {
			setError(
				err.message || "An error occurred during Facebook authentication",
			);
			setIsLoading(false);
		}
	};

	return {
		login,
		isLoading,
		error,
		isAuthenticated,
	};
}
