// infra/providers/auth/google-auth.provider.ts
import {
  GoogleAuthGateway,
  GoogleUserInfo,
} from "../../../app/providers/google-auth.interface";
import axios from "axios";
import { HttpError } from "../../../presentation/http/errors/http-error";

export class GoogleAuthProvider implements GoogleAuthGateway {
  constructor(googleClientId: string) {
    if (!googleClientId) {
      throw new HttpError("GOOGLE_CLIENT_ID not configured", 500);
    }
  }

  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    try {
      const response = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const payload = response.data;
      if (!payload.email || !payload.sub) {
        throw new HttpError("Invalid Google user info response", 401);
      }

      return {
        email: payload.email,
        name: payload.name || "Google User",
        googleId: payload.sub,
      };
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Google auth error:", err.message);
      throw new HttpError("Failed to fetch Google user info", 401);
    }
  }
}
