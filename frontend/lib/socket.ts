import io from "socket.io-client";

// Helper to get access_token from cookies
export const getToken = () => {
	if (typeof window !== "undefined") {
		return document.cookie
			.split("; ")
			.find((row) => row.startsWith("access_token="))
			?.split("=")[1];
	}
	return undefined;
};

// Create socket connection - cookies will be sent automatically by the browser
const socket: any = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
	autoConnect: false,
	auth: {
		token: getToken(),
	},
});

socket.on("connect", () => {
	console.log("[Socket] Connected:", socket.id);
});

socket.on("disconnect", () => {
	console.log("[Socket] Disconnected");
});

socket.on("connect_error", (err: Error) => {
	console.error("[Socket] Connection error:", err);
});

// Enhanced: Helper to safely connect only when token is present
export const safeSocketConnect = () => {
	const token = getToken();
	if (!token) {
		console.warn("[Socket] Not connecting: No token present");
		return;
	}
	// Set the token before connecting
	socket.auth = { token };
	if (!socket.connected) {
		console.log("[Socket] Attempting to connect with token");
		socket.connect();
	} else {
		console.log("[Socket] Already connected");
	}
};

export default socket;
