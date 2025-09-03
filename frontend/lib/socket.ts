import io from "socket.io-client";


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
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
	autoConnect: false,
	auth: {
		token: getToken(),
	},
});

// Remove verbose debug logging for production use

export const safeSocketConnect = () => {
// 	if (!socket.connected) {
// 		// Refresh token before connecting in case cookies changed post-login
// 		// @ts-expect-error socket.auth is acceptable to set
// 		socket.auth = { token: getToken() };
// 		socket.connect();
// 	} 

};

export default socket;
