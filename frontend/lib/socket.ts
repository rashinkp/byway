import io from "socket.io-client";

// Create socket connection - cookies will be sent automatically by the browser
// Since cookies are HttpOnly, we cannot read them via document.cookie
// The browser will automatically send them with the Socket.IO handshake
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
	autoConnect: false,
	// withCredentials ensures cookies are sent with the connection
	withCredentials: true,
	// Remove auth.token since cookies are HttpOnly and cannot be read by JS
	// The backend will read the token from cookies in the handshake
});

// Remove verbose debug logging for production use

export const safeSocketConnect = () => {
	if (!socket.connected) {
		// Cookies are sent automatically by the browser, no need to set auth.token
		socket.connect();
	} 
};

export default socket;
