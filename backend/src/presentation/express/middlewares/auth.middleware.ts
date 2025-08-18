import { Request, Response, NextFunction } from "express";
import { JwtProvider } from "../../../infra/providers/auth/jwt.provider";
import { HttpError } from "../../http/errors/http-error";
import { CookieUtils } from "./cookie.utils";
import { getAppDependencies } from '../../../di/app.dependencies';
import { UserDTO } from "../../../app/dtos/general.dto";


// In-memory store for used refresh tokens (use Redis/database in production)
const usedRefreshTokens = new Set<string>();

// Track ongoing refresh operations to prevent race conditions
const ongoingRefreshes = new Map<string, Promise<{ accessToken: string; refreshToken: string; user: UserDTO }>>();

// Track recently issued tokens to handle frontend using old tokens
const recentlyIssuedTokens = new Map<string, { accessToken: string; refreshToken: string; user: UserDTO; timestamp: number }>();

// Extend Express Request interface using module augmentation
declare module 'express-serve-static-core' {
  interface Request {
    user?: UserDTO;
  }
}

// Helper function to perform token refresh
async function performTokenRefresh(
  refreshToken: string,
  refreshPayload: UserDTO,
  jwtProvider: JwtProvider
): Promise<{ accessToken: string; refreshToken: string; user: UserDTO }> {
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
function getRecentlyIssuedTokens(refreshToken: string): { accessToken: string; refreshToken: string; user: UserDTO } | null {
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
  const payload = accessToken ? jwtProvider.verifyAccessToken(accessToken) as UserDTO : null;

  // 2. If access token is valid, proceed
  if (payload && payload.id && payload.email && payload.role) {
    req.user = payload;
    return next();
  }

  // 3. Access token is expired/invalid, try refresh token
  if (refreshToken) {
    
    // Check if refresh token was already used
    if (usedRefreshTokens.has(refreshToken)) {
      
      // Check if we have recently issued tokens for this refresh token
      const recentTokens = getRecentlyIssuedTokens(refreshToken);
      if (recentTokens) {
        
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
      
      try {
        // Check if there's already an ongoing refresh for this token
        let refreshPromise = ongoingRefreshes.get(refreshToken);
        
        if (!refreshPromise) {
          // Start a new refresh operation
          refreshPromise = performTokenRefresh(refreshToken, refreshPayload as UserDTO, jwtProvider);
          ongoingRefreshes.set(refreshToken, refreshPromise);
          
          // Clean up the promise from the map after completion
          refreshPromise.finally(() => {
            ongoingRefreshes.delete(refreshToken);
          });
        } 
        
        // Wait for the refresh operation to complete
        const { accessToken: newAccessToken, refreshToken: newRefreshToken, user } = await refreshPromise;
        
        CookieUtils.setAuthCookies(res, newAccessToken, newRefreshToken);
        
        
        req.user = user;
        return next();
      } catch (error) {
        return next(new HttpError("Failed to refresh tokens", 500));
      }
    } else {
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
      const payload = accessToken ? jwtProvider.verifyAccessToken(accessToken) as UserDTO : null;

      // 2. If access token is valid, proceed
      if (payload && payload.id && payload.email && payload.role) {
        req.user = payload;
      } else if (refreshToken) {
        
        // Check if refresh token was already used
        if (usedRefreshTokens.has(refreshToken)) {
          
          // Check if we have recently issued tokens for this refresh token
          const recentTokens = getRecentlyIssuedTokens(refreshToken);
          if (recentTokens) {
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
            
            try {
              // Check if there's already an ongoing refresh for this token
              let refreshPromise = ongoingRefreshes.get(refreshToken);
              
              if (!refreshPromise) {
                // Start a new refresh operation
                refreshPromise = performTokenRefresh(refreshToken, refreshPayload as UserDTO, jwtProvider);
                ongoingRefreshes.set(refreshToken, refreshPromise);
                
                // Clean up the promise from the map after completion
                refreshPromise.finally(() => {
                  ongoingRefreshes.delete(refreshToken);
                });
              } 
              // Wait for the refresh operation to complete
              const { accessToken: newAccessToken, refreshToken: newRefreshToken, user } = await refreshPromise;
              
              CookieUtils.setAuthCookies(res, newAccessToken, newRefreshToken);
              
              req.user = user;
            } catch (error) {
              return next(new HttpError("Failed to refresh tokens", 500));
            }
          } else {
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
      const payload = jwtProvider.verifyAccessToken(accessToken) as UserDTO;
      if (payload) {
        req.user = payload;
      }
    } catch {
      // Swallow error for optional auth
    }
  }
  next();
};

setInterval(() => {
  usedRefreshTokens.clear();
  ongoingRefreshes.clear();
  recentlyIssuedTokens.clear();
}, 60 * 60 * 1000);
