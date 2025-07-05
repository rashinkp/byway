import io from "socket.io-client";

// Create socket connection - cookies will be sent automatically by the browser
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
	autoConnect: true,
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

export default socket;
