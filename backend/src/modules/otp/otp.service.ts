import * as nodemailer from "nodemailer";
import { randomInt } from "crypto";
import {
  IGenerateAndSendOtpInput,
  IResendOtpInput,
  IVerifyOtpInput,
} from "./types";
import { IOtpRepository } from "./otp.repository";

export class OtpService {
  constructor(private otpRepository: IOtpRepository) {}

  static generateOtp(): string {
    return randomInt(100000, 999999).toString();
  }

  static async sendOtpEmail(email: string, otp: string): Promise<void> {



    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      text: `Your OTP is ${otp}. It expires in 10 minutes`,
    });
  }

  async verifyOtp(input: IVerifyOtpInput): Promise<{id:string , email:string , role:string}> {
    return this.otpRepository.verifyOtp(input.email, input.otpCode);
  }

  async resendOtp(input: IResendOtpInput) {
    return this.otpRepository.resendOtp(input.email);
  }

  async generateAndSendOtp(input: IGenerateAndSendOtpInput): Promise<void> {
    return this.otpRepository.generateAndSendOtp(input.email, input.userId);
  }
}
