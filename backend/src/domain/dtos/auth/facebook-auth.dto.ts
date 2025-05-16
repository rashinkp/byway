export interface FacebookAuthDto {
  accessToken: string;
  userId: string;
  name: string;
  email?: string;
  picture?: string;
}
