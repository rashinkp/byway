import { JwtProvider } from "../../infra/providers/auth/jwt.provider";
import { Socket } from "socket.io";
import cookie from "cookie";

export async function socketAuthMiddleware(socket: Socket, next: (err?: Error) => void) {
  const socketId = socket.id;
  const ip = socket.handshake.address;
  const userAgent = socket.handshake.headers['user-agent'];
  
  console.log(`🔐 Socket auth attempt: ${socketId}`, {
    ip,
    userAgent,
    timestamp: new Date().toISOString(),
  });

  try {
    // Try to get token from multiple sources
    let token = socket.handshake.auth.token;
    
    console.log(`🔍 Checking auth token sources for socket ${socketId}:`, {
      hasAuthToken: !!token,
      hasAuthHeader: !!socket.handshake.headers.authorization,
      hasCookies: !!socket.handshake.headers.cookie,
    });
    
    // Try Authorization header
    if (!token && socket.handshake.headers.authorization) {
      const authHeader = socket.handshake.headers.authorization as string;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        console.log(`🔑 Found token in Authorization header for socket ${socketId}`);
      }
    }
    
    // Try cookies
    if (!token && socket.handshake.headers.cookie) {
      const cookies = cookie.parse(socket.handshake.headers.cookie);
      token = cookies.access_token;
      if (token) {
        console.log(`🍪 Found token in cookies for socket ${socketId}`);
      }
    }
    
    if (token) {
      console.log(`🔓 Attempting to verify token for socket ${socketId}`);
      const jwtProvider = new JwtProvider();
      const payload = jwtProvider.verifyAccessToken(token);
      
      if (payload) {
        socket.data.user = payload;
        console.log(`✅ Token verified successfully for socket ${socketId} - User: ${(payload as any).id} - Role: ${(payload as any).role} - Email: ${(payload as any).email}`);
      } else {
        console.warn(`❌ Token verification failed for socket ${socketId}`);
      }
    } else {
      console.warn(`⚠️ No authentication token found for socket ${socketId}`, {
        ip,
        userAgent,
      });
    }
    
    next();
  } catch (error) {
    console.error(`❌ Socket auth error for ${socketId}:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      ip,
      userAgent,
    });
    next();
  }
} 