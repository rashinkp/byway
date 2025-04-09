export interface IResetPasswordInput {
  email: string;
  otpCode: string;
  newPassword: string;
}


export interface IForgotPasswordInput {
  email: string;
}