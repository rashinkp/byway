import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtUtil } from "../utils/jwt.util";

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
      return next({
        status: StatusCodes.UNAUTHORIZED,
        message: "Unauthorized access. No token provided.",
      });
    }

    try {
      const decoded = JwtUtil.verifyToken(token);
      // console.log(decoded);

      if (
        requiredRole &&
        decoded.role !== requiredRole
      ) {
        return next({
          status: StatusCodes.FORBIDDEN,
          message: `Forbidden access. ${requiredRole} role required or not matching.`,
        });
      }
      
      req.user = decoded;
      next();
    } catch (error) {
      console.log(error);
      const message =
        error instanceof Error && error.message === "Invalid or expired token"
          ? "Invalid or expired token"
          : "Authentication error";

      return next({
        status: StatusCodes.UNAUTHORIZED,
        message,
      });
    }
  };
};

// General protection without role check
export const protect = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.jwt;

  if (!token) {
    return next({
      status: StatusCodes.UNAUTHORIZED,
      message: "Unauthorized access. No token provided.",
    });
  }

  try {
    const decoded = JwtUtil.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    const message =
      error instanceof Error && error.message === "Invalid or expired token"
        ? "Invalid or expired token"
        : "Authentication error";

    return next({
      status: StatusCodes.UNAUTHORIZED,
      message,
    });
  }
};