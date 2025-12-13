import io from "socket.io-client";

// Create socket connection - cookies will be sent automatically by the browser
// when the server has credentials: true in CORS (which it does)
// The browser automatically sends cookies with same-origin and CORS requests
// when CORS credentials are enabled on the server side
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
	autoConnect: false,
	// Cookies are automatically sent by the browser when:
	// 1. Server CORS has credentials: true (configured in backend)
	// 2. Cookies have proper SameSite and Secure flags (configured in backend)
});

// Remove verbose debug logging for production use

export const safeSocketConnect = () => {
	if (!socket.connected) {
		// Cookies are sent automatically by the browser when CORS credentials are enabled
		socket.connect();
	} 
};

export default socket;
