import { JwtProvider } from "../../../infra/providers/auth/jwt.provider";
import { Socket } from "socket.io";
import cookie from "cookie";

export async function socketAuthMiddleware(socket: Socket, next: (err?: Error) => void) {
  try {
    console.log('[SocketAuth] Authenticating socket:', socket.id);
    console.log('[SocketAuth] Handshake headers:', socket.handshake.headers);
    console.log('[SocketAuth] Handshake auth:', socket.handshake.auth);
    
    // Try to get token from multiple sources
    let token = socket.handshake.auth.token;
    
    // Try Authorization header
    if (!token && socket.handshake.headers.authorization) {
      const authHeader = socket.handshake.headers.authorization as string;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        console.log('[SocketAuth] Token found in Authorization header');
      }
    }
    
    // Try cookies
    if (!token && socket.handshake.headers.cookie) {
      const cookies = cookie.parse(socket.handshake.headers.cookie);
      console.log('[SocketAuth] Parsed cookies:', cookies);
      token = cookies.jwt;
      if (token) {
        console.log('[SocketAuth] Token found in cookies');
      }
    }
    
    console.log('[SocketAuth] Token found:', !!token);
    
    if (token) {
      const jwtProvider = new JwtProvider();
      const payload = await jwtProvider.verify(token);
      console.log('[SocketAuth] JWT payload:', payload);
      
      if (payload) {
        socket.data.user = payload;
        console.log('[SocketAuth] User authenticated:', (payload as any).id);
      } else {
        console.log('[SocketAuth] Invalid JWT token');
      }
    } else {
      console.log('[SocketAuth] No JWT token found');
    }
    
    next();
  } catch (err) {
    console.error('[SocketAuth] Authentication error:', err);
    next();
  }
} 