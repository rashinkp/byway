import jwt from "jsonwebtoken";
import { envConfig } from "../../../presentation/express/configs/env.config";
import { IJwtProvider } from "../../../app/providers/jwt.provider.interface";

export class JwtProvider implements IJwtProvider {
  signAccessToken(payload: object): string {
    return jwt.sign(payload, envConfig.ACCESS_TOKEN_SIGNATURE, {
      expiresIn: "2h",
      algorithm: "HS256",
      issuer: "byway",
    });
  }

  signRefreshToken(payload: object): string {
    return jwt.sign(payload, envConfig.REFRESH_TOKEN_SIGNATURE, {
      expiresIn: "7d",
      algorithm: "HS256",
      issuer: "byway",
    });
  }

  verifyAccessToken(token: string): object | null {
    try {
      return jwt.verify(token, envConfig.ACCESS_TOKEN_SIGNATURE) as object;
    } catch {
      return null;
    }
  }

  verifyRefreshToken(token: string): object | null {
    try {
      return jwt.verify(token, envConfig.REFRESH_TOKEN_SIGNATURE) as object;
    } catch {
      return null;
    }
  }
}
