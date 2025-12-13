import { JwtProvider } from "../../infra/providers/auth/jwt.provider";
import { Socket } from "socket.io";
import cookie from "cookie";

export async function socketAuthMiddleware(socket: Socket, next: (err?: Error) => void) {
  try {
    // Try to get token from multiple sources (order matters: cookies first for httpOnly cookies)
    let token: string | undefined;
    
    // Debug: Log cookie header presence
    const hasCookieHeader = !!socket.handshake.headers.cookie;
    console.log(`[Socket Auth] Socket ${socket.id}: cookie header present: ${hasCookieHeader}`);
    if (hasCookieHeader) {
      console.log(`[Socket Auth] Socket ${socket.id}: cookie header value: ${socket.handshake.headers.cookie?.substring(0, 100)}...`);
    }
    
    // Try cookies first (this is the primary method in production with httpOnly cookies)
    if (socket.handshake.headers.cookie) {
      const cookies = cookie.parse(socket.handshake.headers.cookie);
      token = cookies.access_token;
      console.log(`[Socket Auth] Socket ${socket.id}: access_token from cookie: ${token ? 'present' : 'missing'}`);
    }
    
    // Try auth.token from client (fallback for non-httpOnly scenarios)
    if (!token && socket.handshake.auth?.token) {
      token = socket.handshake.auth.token;
      console.log(`[Socket Auth] Socket ${socket.id}: token from auth: present`);
    }
    
    // Try Authorization header (fallback)
    if (!token && socket.handshake.headers.authorization) {
      const authHeader = socket.handshake.headers.authorization as string;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        console.log(`[Socket Auth] Socket ${socket.id}: token from Authorization header: present`);
      }
    }
    
    if (token) {
      const jwtProvider = new JwtProvider();
      const payload = jwtProvider.verifyAccessToken(token);
      
      if (payload) {
        socket.data.user = payload;
        console.log(`[Socket Auth] Socket ${socket.id}: Authentication successful, userId: ${payload.id}`);
      } else {
        // Log if token was provided but verification failed
        console.warn(`[Socket Auth] Socket ${socket.id}: Token provided but verification failed`);
      }
    } else {
      console.warn(`[Socket Auth] Socket ${socket.id}: No token found in any source`);
    }
    
    next();
  } catch (error) {
    // Log error but don't block connection (allows unauthenticated connections)
    console.error(`[Socket Auth] Socket auth middleware error for ${socket.id}:`, error);
    next();
  }
} 