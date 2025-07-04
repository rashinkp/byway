import jwt from "jsonwebtoken";
import { envConfig } from "../../../presentation/express/configs/env.config";
import { IJwtProvider } from "../../../app/providers/I.jwt.provider";


export class JwtProvider implements IJwtProvider {
  sign(payload: object): string {
    return jwt.sign(payload, envConfig.JWT_SECRET, { expiresIn: "1d" });
  }

  verify(token: string): object | null {
    try {
      return jwt.verify(token, envConfig.JWT_SECRET) as object;
    } catch {
      return null;
    }
  }
}
