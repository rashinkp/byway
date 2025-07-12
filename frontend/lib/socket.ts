import io from "socket.io-client";

// Helper to get access_token from cookies
export const getToken = () => {
	if (typeof window !== "undefined") {
		const token = document.cookie
			.split("; ")
			.find((row) => row.startsWith("access_token="))
			?.split("=")[1];
		
		if (token) {
			console.log("[Socket] Token found in cookies");
		} else {
			console.log("[Socket] No token found in cookies");
		}
		
		return token;
	}
	return undefined;
};

// Create socket connection - cookies will be sent automatically by the browser
const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "";
console.log("[Socket] Initializing with URL:", socketUrl);

const socket: any = io(socketUrl, {
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
	console.error("[Socket] Error message:", err.message);
});

// Enhanced: Helper to safely connect only when token is present
export const safeSocketConnect = (retryCount = 0) => {
	const token = getToken();
	if (!token) {
		console.warn("[Socket] Not connecting: No token present");
		
		// Retry up to 3 times with 1 second intervals
		if (retryCount < 3) {
			console.log(`[Socket] Retrying connection in 1 second (attempt ${retryCount + 1}/3)`);
			setTimeout(() => safeSocketConnect(retryCount + 1), 1000);
		}
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
