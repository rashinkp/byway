import io from "socket.io-client";

// Helper to get access_token from cookies
const getToken = () => {
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
	autoConnect: true,
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

export default socket;
