import { Request, Response, NextFunction } from "express";
import { JwtProvider } from "../../../infra/providers/auth/jwt.provider";
import { CookieService } from "../../http/utils/cookie.service";
import { HttpError } from "../../http/errors/http-error";

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

// In-memory store for used refresh tokens (use Redis/database in production)
const usedRefreshTokens = new Set<string>();

// Extend Express Request interface using module augmentation
declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const jwtProvider = new JwtProvider();
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  if (!accessToken && !refreshToken) {
    return next(new HttpError("No token provided", 401));
  }

  // 1. Try access token first
  let payload = accessToken ? jwtProvider.verifyAccessToken(accessToken) as JwtPayload : null;

  // 2. If access token is valid, proceed
  if (payload && payload.id && payload.email && payload.role) {
    req.user = payload;
    return next();
  }

  // 3. Access token is expired/invalid, try refresh token
  if (refreshToken) {
    console.log("[Auth] Access token expired/invalid, attempting refresh token");
    
    // Check if refresh token was already used
    if (usedRefreshTokens.has(refreshToken)) {
      console.log("[Auth] Refresh token already used:", refreshToken.substring(0, 10) + "...");
      return next(new HttpError("Refresh token already used", 401));
    }

    const refreshPayload = jwtProvider.verifyRefreshToken(refreshToken);
    if (
      refreshPayload &&
      typeof refreshPayload === "object" &&
      "id" in refreshPayload &&
      "email" in refreshPayload &&
      "role" in refreshPayload
    ) {
      console.log("[Auth] Refresh token valid, creating new tokens");
      
      try {
        // Immediately mark refresh token as used to prevent reuse
        usedRefreshTokens.add(refreshToken);
        
        // Create clean payload for new tokens
        const cleanPayload = {
          id: (refreshPayload as any).id,
          email: (refreshPayload as any).email,
          role: (refreshPayload as any).role,
        };
        
        // Create new tokens
        const newAccessToken = jwtProvider.signAccessToken(cleanPayload);
        const newRefreshToken = jwtProvider.signRefreshToken(cleanPayload);
        
        // Set new cookies
        console.log("[CookieService] Setting new access_token cookie");
        res.cookie("access_token", newAccessToken, {
          httpOnly: process.env.NODE_ENV === "production",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 1 * 60 * 1000, // 1 minute
        });
        
        console.log("[CookieService] Setting new refresh_token cookie");
        res.cookie("refresh_token", newRefreshToken, {
          httpOnly: process.env.NODE_ENV === "production",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        
        console.log("[Auth] New tokens created and set successfully");
        
        req.user = cleanPayload;
        return next();
      } catch (error) {
        console.error("[Auth] Error creating new tokens:", error);
        return next(new HttpError("Failed to refresh tokens", 500));
      }
    } else {
      console.log("[Auth] Invalid refresh token");
      return next(new HttpError("Invalid refresh token", 401));
    }
  }

  return next(new HttpError("Invalid or expired token", 401));
};

export const restrictTo =
  (...roles: string[]) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const jwtProvider = new JwtProvider();
      const accessToken = req.cookies.access_token;
      const refreshToken = req.cookies.refresh_token;

      if (!accessToken && !refreshToken) {
        throw new HttpError("No token provided", 401);
      }

      // 1. Try access token first
      let payload = accessToken ? jwtProvider.verifyAccessToken(accessToken) as JwtPayload : null;

      // 2. If access token is valid, proceed
      if (payload && payload.id && payload.email && payload.role) {
        req.user = payload;
      } else if (refreshToken) {
        // 3. Access token is expired/invalid, try refresh token
        console.log("[Auth] Access token expired/invalid, attempting refresh token (restrictTo)");
        
        // Check if refresh token was already used
        if (usedRefreshTokens.has(refreshToken)) {
          console.log("[Auth] Refresh token already used (restrictTo):", refreshToken.substring(0, 10) + "...");
          throw new HttpError("Refresh token already used", 401);
        }

        const refreshPayload = jwtProvider.verifyRefreshToken(refreshToken);
        if (
          refreshPayload &&
          typeof refreshPayload === "object" &&
          "id" in refreshPayload &&
          "email" in refreshPayload &&
          "role" in refreshPayload
        ) {
          console.log("[Auth] Refresh token valid, creating new tokens (restrictTo)");
          
          try {
            // Immediately mark refresh token as used to prevent reuse
            usedRefreshTokens.add(refreshToken);
            
            // Create clean payload for new tokens
            const cleanPayload = {
              id: (refreshPayload as any).id,
              email: (refreshPayload as any).email,
              role: (refreshPayload as any).role,
            };
            
            // Create new tokens
            const newAccessToken = jwtProvider.signAccessToken(cleanPayload);
            const newRefreshToken = jwtProvider.signRefreshToken(cleanPayload);
            
            // Set new cookies
            console.log("[CookieService] Setting new access_token cookie");
            res.cookie("access_token", newAccessToken, {
              httpOnly: process.env.NODE_ENV === "production",
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 1 * 60 * 1000, // 1 minute
            });
            
            console.log("[CookieService] Setting new refresh_token cookie");
            res.cookie("refresh_token", newRefreshToken, {
              httpOnly: process.env.NODE_ENV === "production",
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 24 * 60 * 60 * 1000, // 1 day
            });
            
            console.log("[Auth] New tokens created and set successfully (restrictTo)");
            
            req.user = cleanPayload;
          } catch (error) {
            console.error("[Auth] Error creating new tokens (restrictTo):", error);
            throw new HttpError("Failed to refresh tokens", 500);
          }
        } else {
          console.log("[Auth] Invalid refresh token (restrictTo)");
          throw new HttpError("Invalid refresh token", 401);
        }
      } else {
        throw new HttpError("Invalid or expired token", 401);
      }

      // 4. Check role permissions
      if (!req.user || !req.user.role) {
        throw new HttpError("Invalid token", 401);
      }
      if (!roles.includes(req.user.role)) {
        throw new HttpError("Insufficient permissions", 403);
      }

      next();
    };

export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const jwtProvider = new JwtProvider();
  const accessToken = req.cookies.access_token;
  if (accessToken) {
    try {
      const payload = jwtProvider.verifyAccessToken(accessToken) as JwtPayload;
      if (payload) {
        req.user = payload;
      }
    } catch {
      // Swallow error for optional auth
    }
  }
  next();
};

// Clean up used refresh tokens periodically (every hour)
setInterval(() => {
  usedRefreshTokens.clear();
  console.log("[Auth] Cleared used refresh tokens cache");
}, 60 * 60 * 1000);
