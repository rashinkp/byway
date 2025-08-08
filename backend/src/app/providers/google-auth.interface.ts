

export interface GoogleUserInfo {
  email: string;
  name: string;
  googleId: string;
  picture?: string;
}



export interface GoogleAuthGateway {
  getUserInfo(accessToken: string): Promise<GoogleUserInfo>;
}
