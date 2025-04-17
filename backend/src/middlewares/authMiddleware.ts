import { Request, Response, NextFunction } from "express";
import { JwtUtil } from "../utils/jwt.util";
import { AppError } from "../utils/appError";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;  
    role: string;
  };
}

export const authMiddleware = (requiredRole: string) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    const token = req.cookies?.jwt;

    if (!token) {
      throw AppError.unauthorized("No token provided");
    }

    try {
      const decoded = JwtUtil.verifyToken(token);

      if (requiredRole && decoded.role !== requiredRole) {
        throw AppError.forbidden(`${requiredRole} role required`);
      }

      req.user = decoded;
      next();
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Invalid or expired token"
      ) {
        throw AppError.unauthorized("Invalid or expired token");
      }
      throw AppError.unauthorized("Authentication error");
    }
  };
};

export const protect = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.jwt;

  if (!token) {
    throw AppError.unauthorized("No token provided");
  }

  try {
    const decoded = JwtUtil.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Invalid or expired token"
    ) {
      throw AppError.unauthorized("Invalid or expired token");
    }
    throw AppError.unauthorized("Authentication error");
  }
};
