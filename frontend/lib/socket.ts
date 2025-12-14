import io from "socket.io-client";

/**
 * Socket.IO client configuration
 * 
 * IMPORTANT: When using httpOnly cookies (which cannot be read by JavaScript),
 * the browser automatically sends cookies with the socket connection IF:
 * 1. withCredentials is set to true
 * 2. The backend CORS is configured to accept credentials
 * 3. The cookie domain/path matches the request
 * 
 * The backend socket auth middleware will read the token from the cookie header.
 */
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
        autoConnect: false,
        withCredentials: true,
      } as any);
      

export const safeSocketConnect = () => {
        if (!socket.connected) {
                // No need to set auth.token - cookies are sent automatically by the browser
                socket.connect();
        }
};

export default socket;