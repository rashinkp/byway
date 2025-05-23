import { Request, Response, NextFunction } from "express";
import { JwtProvider } from "../../../infra/providers/auth/jwt.provider";
import { HttpError } from "../../http/errors/http-error";

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export const restrictTo =
  (...roles: string[]) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies.jwt;
    if (!token) {
      throw new HttpError("No token provided", 401);
    }
    

    try {
      const jwtProvider = new JwtProvider();
      const payload = (await jwtProvider.verify(token)) as JwtPayload;
      if (!payload || !payload.role) {
        throw new HttpError("Invalid token", 401);
      }
      if (!roles.includes(payload.role)) {
        throw new HttpError("Insufficient permissions", 403);
      }
      req.user = payload;
      next();
    } catch (error) {
      throw new HttpError("Invalid or expired token", 401);
    }
  };

// Optional authentication
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const jwtProvider = new JwtProvider();
      const payload = (await jwtProvider.verify(token)) as JwtPayload;
      if (payload) {
        req.user = payload;
      }
    } catch (error) {
      
    }
  }
  next();
};

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
