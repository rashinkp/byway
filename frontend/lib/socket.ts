import io from "socket.io-client";


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
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
	autoConnect: false,
	auth: {
		token: getToken(),
	},
});

// Debug logging for socket events (enabled if NEXT_PUBLIC_SOCKET_DEBUG=1 or not production)
if (
	typeof window !== "undefined" &&
	(process.env.NEXT_PUBLIC_SOCKET_DEBUG === "1" || process.env.NODE_ENV !== "production")
) {
	// Connection lifecycle logs
	socket.on("connect", () => {
		console.log("[socket] connect", { id: socket.id });
	});

	socket.on("disconnect", (reason: string) => {
		console.log("[socket] disconnect", { reason });
	});

	socket.on("connect_error", (err: Error) => {
		console.log("[socket] connect_error", { message: err.message, data: err });
	});

	// Log every incoming event payload once connected
	// @ts-expect-error onAny exists in socket.io-client v4, not in older types
	socket.onAny((event: string, ...args: unknown[]) => {
		console.log("[socket][in]", event, ...args);
	});
}

export const safeSocketConnect = () => {
	if (!socket.connected) {
		// Refresh token before connecting in case cookies changed post-login
		// @ts-expect-error socket.auth is acceptable to set
		socket.auth = { token: getToken() };
		socket.connect();
	} 
};

export default socket;
