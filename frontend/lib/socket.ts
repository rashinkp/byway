import io from "socket.io-client";

// Create socket connection - cookies will be sent automatically by the browser
// withCredentials is required for cookies to be sent in cross-origin scenarios (production)
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
	autoConnect: false,
	withCredentials: true,
	// Don't set auth.token here since cookies are httpOnly in production
	// The browser will automatically send cookies with the handshake request
});

// Remove verbose debug logging for production use

export const safeSocketConnect = () => {
	if (!socket.connected) {
		// Cookies are sent automatically by the browser with withCredentials: true
		socket.connect();
	} 
};

export default socket;
