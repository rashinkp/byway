import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import { UserVerification } from "../../../domain/entities/user-verification.entity";
import { IAuthRepository } from "../../../app/repositories/auth.repository";
import { IOtpProvider } from "../../../app/providers/I.otp-provider";
import { envConfig } from "../../presentation/express/configs/env.config";


export class OtpProvider implements IOtpProvider {
  private transporter;

  constructor(private authRepository: IAuthRepository) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: envConfig.EMAIL_USER,
        pass: envConfig.EMAIL_PASS,
      },
    });
  }

  async generateOtp(
    email: string,
    userId: string,
    type: "VERIFICATION" | "RESET"
  ): Promise<UserVerification> {
    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create UserVerification
    const verification = UserVerification.create({
      id: uuidv4(),
      userId,
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      attempts: 0,
      isUsed: false,
      createdAt: new Date(),
    });

    // Store verification
    await this.authRepository.createVerification(verification);

    // Send OTP via email
    await this.transporter.sendMail({
      to: email,
      subject:
        type === "VERIFICATION" ? "Verify Your Email" : "Reset Your Password",
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    });

    return verification;
  }
}
