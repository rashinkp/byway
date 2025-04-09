export interface IVerifyOtpInput {
  email: string;
  otpCode: string;
}

export interface IResendOtpInput {
  email: string;
}

export interface IGenerateAndSendOtpInput {
  email: string;
  userId: string;
}
