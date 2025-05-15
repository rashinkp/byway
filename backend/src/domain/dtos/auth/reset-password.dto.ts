export interface ResetPasswordDto {
  email: string;
  token: string;
  newPassword: string;
}
