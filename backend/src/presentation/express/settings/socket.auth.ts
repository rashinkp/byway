import { JwtProvider } from "../../../infra/providers/auth/jwt.provider";
import { Socket } from "socket.io";

export async function socketAuthMiddleware(socket: Socket, next: (err?: Error) => void) {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers['authorization']?.split(' ')[1];
    if (!token) return next(new Error("No token provided"));
    const jwtProvider = new JwtProvider();
    const payload = await jwtProvider.verify(token);
    if (!payload) return next(new Error("Invalid token"));
    socket.data.user = payload;
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
} 