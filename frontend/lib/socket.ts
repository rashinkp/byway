import io from "socket.io-client";

// Socket.IO client configuration for production
// withCredentials must be set to true to send cookies in cross-origin requests
// This is essential for httpOnly cookie authentication in production
const socketOptions = {
	autoConnect: false,
	withCredentials: true, // Enable sending cookies in cross-origin requests
} as any; // Type assertion: withCredentials exists at runtime but may not be in types

// Create socket connection
// withCredentials: true ensures cookies are sent with the Socket.IO handshake
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", socketOptions);

// Remove verbose debug logging for production use

export const safeSocketConnect = () => {
	if (!socket.connected) {
		// Cookies are automatically sent by browser via polling transport XMLHttpRequest
		socket.connect();
	} 
};

export default socket;
