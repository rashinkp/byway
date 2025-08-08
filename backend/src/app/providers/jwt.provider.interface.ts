export interface IJwtProvider {
  signAccessToken(payload: object): string;
  signRefreshToken(payload: object): string;
  verifyAccessToken(token: string): object | null;
  verifyRefreshToken(token: string): object | null;
}
