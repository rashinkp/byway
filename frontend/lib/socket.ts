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
	// auth: {
	// 	token: getToken(),
	// },
});



export const safeSocketConnect = () => {
	if (!socket.connected) {
		socket.connect();
	} 
};

export default socket;
