import io from "socket.io-client";

// Create socket connection - cookies (including HttpOnly) will be sent automatically by the browser
const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "";
console.log("[Socket] Initializing with URL:", socketUrl);

const socket: any = io(socketUrl, {
	autoConnect: false,
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

// Enhanced: Helper to safely connect
export const safeSocketConnect = () => {
	if (!socket.connected) {
		console.log("[Socket] Attempting to connect");
		socket.connect();
	} else {
		console.log("[Socket] Already connected");
	}
};

export default socket;
