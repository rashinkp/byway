import { Request, Response, NextFunction } from "express";
import { JwtProvider } from "../../../infra/providers/auth/jwt.provider";
import { HttpError } from "../../http/errors/http-error";
import { CookieUtils } from "./cookie.utils";
import { getAppDependencies } from '../../../di/app.dependencies';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

// In-memory store for used refresh tokens (use Redis/database in production)
const usedRefreshTokens = new Set<string>();

// Track ongoing refresh operations to prevent race conditions
const ongoingRefreshes = new Map<string, Promise<{ accessToken: string; refreshToken: string; user: JwtPayload }>>();

// Track recently issued tokens to handle frontend using old tokens
const recentlyIssuedTokens = new Map<string, { accessToken: string; refreshToken: string; user: JwtPayload; timestamp: number }>();

// Extend Express Request interface using module augmentation
declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

// Helper function to perform token refresh
async function performTokenRefresh(
  refreshToken: string,
  refreshPayload: JwtPayload,
  jwtProvider: JwtProvider
): Promise<{ accessToken: string; refreshToken: string; user: JwtPayload }> {
  // Create clean payload for new tokens
  const cleanPayload = {
    id: refreshPayload.id,
    email: refreshPayload.email,
    role: refreshPayload.role,
  };
  
  const accessToken = jwtProvider.signAccessToken(cleanPayload);
  const newRefreshToken = jwtProvider.signRefreshToken(cleanPayload);
  
  // Mark the old refresh token as used
  usedRefreshTokens.add(refreshToken);
  
  const result = { accessToken, refreshToken: newRefreshToken, user: cleanPayload };
  
  // Store recently issued tokens for a short time to handle frontend using old tokens
  recentlyIssuedTokens.set(refreshToken, {
    ...result,
    timestamp: Date.now()
  });
  
  return result;
}

// Helper function to check if we have recently issued tokens for this user
function getRecentlyIssuedTokens(refreshToken: string): { accessToken: string; refreshToken: string; user: JwtPayload } | null {
  const recent = recentlyIssuedTokens.get(refreshToken);
  if (recent && Date.now() - recent.timestamp < 5000) { // 5 seconds window
    return recent;
  }
  return null;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const jwtProvider = new JwtProvider();
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  if (!accessToken && !refreshToken) {
    return next(new HttpError("No token provided", 401));
  }

  // 1. Try access token first
  const payload = accessToken ? jwtProvider.verifyAccessToken(accessToken) as JwtPayload : null;

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
      
      // Check if we have recently issued tokens for this refresh token
      const recentTokens = getRecentlyIssuedTokens(refreshToken);
      if (recentTokens) {
        console.log("[Auth] Using recently issued tokens for already used refresh token");
        
        // Set the recently issued tokens
        console.log("[CookieService] Setting recently issued tokens");
        CookieUtils.setAuthCookies(res, recentTokens.accessToken, recentTokens.refreshToken);
        
        req.user = recentTokens.user;
        return next();
      }
      
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
        // Check if there's already an ongoing refresh for this token
        let refreshPromise = ongoingRefreshes.get(refreshToken);
        
        if (!refreshPromise) {
          // Start a new refresh operation
          refreshPromise = performTokenRefresh(refreshToken, refreshPayload as JwtPayload, jwtProvider);
          ongoingRefreshes.set(refreshToken, refreshPromise);
          
          // Clean up the promise from the map after completion
          refreshPromise.finally(() => {
            ongoingRefreshes.delete(refreshToken);
          });
        } else {
          console.log("[Auth] Waiting for ongoing refresh operation");
        }
        
        // Wait for the refresh operation to complete
        const { accessToken: newAccessToken, refreshToken: newRefreshToken, user } = await refreshPromise;
        
        // Set new cookies
        console.log("[CookieService] Setting new tokens");
        CookieUtils.setAuthCookies(res, newAccessToken, newRefreshToken);
        
        console.log("[Auth] New tokens created and set successfully");
        
        req.user = user;
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
        return next(new HttpError("No token provided", 401));
      }

      // 1. Try access token first
      const payload = accessToken ? jwtProvider.verifyAccessToken(accessToken) as JwtPayload : null;

      // 2. If access token is valid, proceed
      if (payload && payload.id && payload.email && payload.role) {
        req.user = payload;
      } else if (refreshToken) {
        // 3. Access token is expired/invalid, try refresh token
        console.log("[Auth] Access token expired/invalid, attempting refresh token (restrictTo)");
        
        // Check if refresh token was already used
        if (usedRefreshTokens.has(refreshToken)) {
          console.log("[Auth] Refresh token already used (restrictTo):", refreshToken.substring(0, 10) + "...");
          
          // Check if we have recently issued tokens for this refresh token
          const recentTokens = getRecentlyIssuedTokens(refreshToken);
          if (recentTokens) {
            console.log("[Auth] Using recently issued tokens for already used refresh token (restrictTo)");
            
            // Set the recently issued tokens
            console.log("[CookieService] Setting recently issued tokens");
            CookieUtils.setAuthCookies(res, recentTokens.accessToken, recentTokens.refreshToken);
            
            req.user = recentTokens.user;
          } else {
            return next(new HttpError("Refresh token already used", 401));
          }
        } else {
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
              // Check if there's already an ongoing refresh for this token
              let refreshPromise = ongoingRefreshes.get(refreshToken);
              
              if (!refreshPromise) {
                // Start a new refresh operation
                refreshPromise = performTokenRefresh(refreshToken, refreshPayload as JwtPayload, jwtProvider);
                ongoingRefreshes.set(refreshToken, refreshPromise);
                
                // Clean up the promise from the map after completion
                refreshPromise.finally(() => {
                  ongoingRefreshes.delete(refreshToken);
                });
              } else {
                console.log("[Auth] Waiting for ongoing refresh operation (restrictTo)");
              }
              
              // Wait for the refresh operation to complete
              const { accessToken: newAccessToken, refreshToken: newRefreshToken, user } = await refreshPromise;
              
              // Set new cookies
              console.log("[CookieService] Setting new tokens");
              CookieUtils.setAuthCookies(res, newAccessToken, newRefreshToken);
              
              console.log("[Auth] New tokens created and set successfully (restrictTo)");
              
              req.user = user;
            } catch (error) {
              console.error("[Auth] Error creating new tokens (restrictTo):", error);
              return next(new HttpError("Failed to refresh tokens", 500));
            }
          } else {
            console.log("[Auth] Invalid refresh token (restrictTo)");
            return next(new HttpError("Invalid refresh token", 401));
          }
        }
      } else {
        return next(new HttpError("Invalid or expired token", 401));
      }

      // --- NEW: Check if user is active (not deleted) ---
      try {
        const { checkUserActiveUseCase } = getAppDependencies();
        await checkUserActiveUseCase.execute(req.user.id);
      } catch (err) {
        console.log("[restrictTo] Passing error to next:", err);
        return next(err);
      }
      // --- END NEW ---

      // 4. Check role permissions
      if (!req.user || !req.user.role) {
        return next(new HttpError("Invalid token", 401));
      }
      if (!roles.includes(req.user.role)) {
        return next(new HttpError("Insufficient permissions", 403));
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

// Clean up used refresh tokens, ongoing refreshes, and recently issued tokens periodically (every hour)
setInterval(() => {
  usedRefreshTokens.clear();
  ongoingRefreshes.clear();
  recentlyIssuedTokens.clear();
  console.log("[Auth] Cleared used refresh tokens cache, ongoing refreshes, and recently issued tokens");
}, 60 * 60 * 1000);
