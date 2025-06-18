import { JwtProvider } from "../../../infra/providers/auth/jwt.provider";
import { Socket } from "socket.io";
import cookie from "cookie";

export async function socketAuthMiddleware(socket: Socket, next: (err?: Error) => void) {
  try {
    // Try to get token from multiple sources
    let token = socket.handshake.auth.token;
    
    // Try Authorization header
    if (!token && socket.handshake.headers.authorization) {
      const authHeader = socket.handshake.headers.authorization as string;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    // Try cookies
    if (!token && socket.handshake.headers.cookie) {
      const cookies = cookie.parse(socket.handshake.headers.cookie);
      token = cookies.jwt;
    }
    
    if (token) {
      const jwtProvider = new JwtProvider();
      const payload = await jwtProvider.verify(token);
      
      if (payload) {
        socket.data.user = payload;
      }
    }
    
    next();
  } catch (err) {
    next();
  }
} 