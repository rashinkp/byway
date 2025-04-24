// src/adapters/gateways/GoogleAuthGateway.ts
import axios from "axios";
import { AppError } from "../../utils/appError";
import { IGoogleAuthGateway } from "../../modules/auth/auth.types";

export class GoogleAuthGateway implements IGoogleAuthGateway {
  async getUserInfo(accessToken: string): Promise<{
    email: string;
    name?: string;
    sub: string;
    [key: string]: any;
  }> {
    try {
      const response = await axios.get(
        process.env.GOOGLE_AUTH_VERIFY_URL as string,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const payload = response.data;

      if (!payload || !payload.email || !payload.sub) {
        throw AppError.badRequest("Invalid Google access token");
      }

      return payload;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw AppError.badRequest("Invalid Google access token");
      }
      throw AppError.badRequest(
        error.message || "Failed to fetch Google user info"
      );
    }
  }
}
