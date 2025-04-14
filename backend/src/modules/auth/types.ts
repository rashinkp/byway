export interface IResetPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
}


export interface IForgotPasswordInput {
  email: string;
}