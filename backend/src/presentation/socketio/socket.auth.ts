import { JwtProvider } from "../../infra/providers/auth/jwt.provider";
import { Socket } from "socket.io";
import cookie from "cookie";

export async function socketAuthMiddleware(socket: Socket, next: (err?: Error) => void) {
  try {
    // Try to get token from multiple sources (in order of preference)
    let token: string | undefined;
    const cookieHeader = socket.handshake.headers.cookie;
    
    // 1. Try cookies first (primary method for HttpOnly cookies)
    if (cookieHeader) {
      const cookies = cookie.parse(cookieHeader);
      token = cookies.access_token;
    }
    
    // 2. Try auth.token (fallback for non-HttpOnly scenarios)
    if (!token && socket.handshake.auth?.token) {
      token = socket.handshake.auth.token;
    }
    
    // 3. Try Authorization header (fallback)
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
        // Token is invalid/expired - log but don't block connection
        // The connection will proceed but socket.data.user will be undefined
        console.warn(`[Socket Auth] Invalid or expired token for socket ${socket.id}`);
      }
    } else {
      // No token found - log for debugging
      const hasCookies = !!cookieHeader;
      const cookieNames = cookieHeader ? Object.keys(cookie.parse(cookieHeader)) : [];
      console.warn(`[Socket Auth] No token found for socket ${socket.id}.`, {
        hasCookies,
        cookieNames,
        hasAuthToken: !!socket.handshake.auth?.token,
        hasAuthHeader: !!socket.handshake.headers.authorization
      });
    }
    
    // Always call next() to allow connection even without auth
    // Handlers should check socket.data.user before processing sensitive operations
    next();
  } catch (error) {
    // Log error but don't block connection
    console.error(`[Socket Auth] Error during authentication for socket ${socket.id}:`, error);
    next();
  }
} 