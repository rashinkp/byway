import { jwtDecode } from "jwt-decode";

interface JwtPayload {
	id: string;
	email: string;
	role: "USER" | "INSTRUCTOR" | "ADMIN";
	iat: number;
	exp: number;
}

export function decodeToken(token: string): JwtPayload | null {
	try {
		return jwtDecode<JwtPayload>(token);
	} catch (error) {
		console.error("Failed to decode token:", error);
		return null;
	}
}

export function isTokenExpired(token: string): boolean {
	try {
		const decoded = decodeToken(token);
		if (!decoded) return true;

		const currentTime = Math.floor(Date.now() / 1000);
		return decoded.exp < currentTime;
	} catch {
		return true;
	}
}

export function getTokenFromCookies(
	cookieHeader: string | null,
): string | null {
	if (!cookieHeader) return null;

	const cookies = cookieHeader.split(";");
	const jwtCookie = cookies.find((cookie) => cookie.trim().startsWith("access_token="));

	if (!jwtCookie) return null;

	return jwtCookie.split("=")[1];
}
