import { JwtProvider } from "../../infra/providers/auth/jwt.provider";
import { Socket } from "socket.io";
import cookie from "cookie";

export async function socketAuthMiddleware(socket: Socket, next: (err?: Error) => void) {
  try {
    // Try to get token from multiple sources (order matters: cookies first for httpOnly cookies)
    let token: string | undefined;
    
    // Try cookies first (this is the primary method in production with httpOnly cookies)
    if (socket.handshake.headers.cookie) {
      const cookies = cookie.parse(socket.handshake.headers.cookie);
      token = cookies.access_token;
    }
    
    // Try auth.token from client (fallback for non-httpOnly scenarios)
    if (!token && socket.handshake.auth?.token) {
      token = socket.handshake.auth.token;
    }
    
    // Try Authorization header (fallback)
    if (!token && socket.handshake.headers.authorization) {
      const authHeader = socket.handshake.headers.authorization as string;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    if (token) {
      const jwtProvider = new JwtProvider();
      const payload = jwtProvider.verifyAccessToken(token);
      
      if (payload) {
        socket.data.user = payload;
      } else {
        // Log if token was provided but verification failed
        console.warn(`Socket ${socket.id}: Token provided but verification failed`);
      }
    }
    
    next();
  } catch (error) {
    // Log error but don't block connection (allows unauthenticated connections)
    console.error(`Socket auth middleware error for ${socket.id}:`, error);
    next();
  }
} 