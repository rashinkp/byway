// import { HttpError } from "../../../presentation/http/utils/HttpErrors";
// import axios from "axios";

// export interface FacebookUserInfo {
//   email?: string;
//   name: string;
//   facebookId: string;
//   picture?: string;
// }

// export interface FacebookAuthGateway {
//   getUserInfo(data: {
//     accessToken: string;
//     userId: string;
//   }): Promise<FacebookUserInfo>;
// }

// export class FacebookAuthProvider implements FacebookAuthGateway {
//   constructor(
//     private facebookAppId: string,
//     private facebookAppSecret: string
//   ) {
//     if (!facebookAppId || !facebookAppSecret) {
//       throw new HttpError("Facebook app credentials not configured", 500);
//     }
//   }

//   async getUserInfo(data: {
//     accessToken: string;
//     userId: string;
//   }): Promise<FacebookUserInfo> {
//     const { accessToken, userId } = data;
//     try {
//       // Optional: Verify access token (uncomment if needed)
//       /*
//       const debugResponse = await axios.get(
//         `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${this.facebookAppId}|${this.facebookAppSecret}`
//       );
//       const debugData = debugResponse.data;
//       if (!debugData.data.is_valid || debugData.data.user_id !== userId) {
//         throw new HttpError("Invalid or mismatched Facebook access token", 401);
//       }
//       */

//       // Fetch user info
//       const response = await axios.get("https://graph.facebook.com/v20.0/me", {
//         params: {
//           fields: "id,name,email,picture",
//           access_token: accessToken,
//         },
//       });

//       const payload = response.data;
//       if (!payload.id) {
//         throw new HttpError("Invalid Facebook user info response", 401);
//       }

//       return {
//         facebookId: payload.id,
//         name: payload.name || "Facebook User",
//         email: payload.email,
//         picture: payload.picture?.data?.url,
//       };
//     } catch (error: any) {
//       console.error("Facebook auth error:", error.message);
//       throw new HttpError("Failed to fetch Facebook user info", 401);
//     }
//   }
// }
