export interface IVerifyOtpInput {
  email: string;
  otp: string;
}

export interface IResendOtpInput {
  email: string;
}

export interface IGenerateAndSendOtpInput {
  email: string;
  userId: string;
}
