import io, { Socket } from "socket.io-client";


// export const getToken = () => {
// 	if (typeof window !== "undefined") {
// 		return document.cookie
// 			.split("; ")
// 			.find((row) => row.startsWith("access_token="))
// 			?.split("=")[1];
// 	}
// 	return undefined;
// };

// Create socket connection - cookies will be sent automatically by the browser
const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
	autoConnect: false,
	// auth: {
	// 	token: getToken(),
	// },
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
