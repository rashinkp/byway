import io from "socket.io-client";

// Function to get JWT token from cookies
const getJwtToken = (): string | null => {
	if (typeof document === "undefined") return null;

	const cookies = document.cookie.split(";");
	const jwtCookie = cookies.find((cookie) => cookie.trim().startsWith("access_token="));

	if (!jwtCookie) return null;

	return jwtCookie.split("=")[1];
};

// Create socket connection with JWT token
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
	autoConnect: true,
	auth: {
		token: getJwtToken() || undefined,
	},
});

socket.on("connect", () => {
	console.log("[Socket] Connected:", socket.id);
	console.log("[Socket] JWT token present:", !!getJwtToken());
});

socket.on("disconnect", () => {
	console.log("[Socket] Disconnected");
});

socket.on("connect_error", (err: Error) => {
	console.error("[Socket] Connection error:", err);
});

export default socket;
