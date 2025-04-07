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

      if (
        requiredRole &&
        decoded.role !== requiredRole &&
        decoded.id !== req.body.userId
      ) {
        return next({
          status: StatusCodes.FORBIDDEN,
          message: `Forbidden access. ${requiredRole} role required or not matching.`,
        });
      }

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
};

// General protection without role check
export const protect = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.jwt;

  if (!token) {
    // Fixed typo: ifbundled -> if
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: "error",
      message: "Unauthorized access. No token provided.",
    });
  }

  try {
    const decoded = JwtUtil.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    // Type the error as an unknown type and handle it
    const message =
      error instanceof Error && error.message === "Invalid or expired token"
        ? "Invalid or expired token"
        : "Authentication error";

    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: "error",
      message,
    });
  }
};
