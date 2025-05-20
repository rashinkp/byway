export interface IJwtProvider {
  sign(payload: object): string;
  verify(token: string): object | null;
}
