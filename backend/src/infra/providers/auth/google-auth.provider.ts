// infra/providers/auth/google-auth.provider.ts
import { HttpError } from "../../../presentation/http/utils/HttpErrors";
import axios from "axios";

export interface GoogleUserInfo {
  email: string;
  name: string;
  googleId: string;
  picture?: string;
}

export interface GoogleAuthGateway {
  getUserInfo(accessToken: string): Promise<GoogleUserInfo>;
}

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
    } catch (error: any) {
      console.error("Google auth error:", error.message);
      throw new HttpError("Failed to fetch Google user info", 401);
    }
  }
}
