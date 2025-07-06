// import nodemailer, { Transporter } from "nodemailer";
// import { envConfig } from "../../../presentation/express/configs/env.config";

// export interface EmailProvider {
//   sendOtpEmail(email: string, otp: string): Promise<void>;
//   sendResetTokenEmail(email: string, token: string): Promise<void>;
// }

// export class EmailProvider implements EmailProvider {
//   private transporter: Transporter;

//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       host: envConfig.SMTP_HOST,
//       port: envConfig.SMTP_PORT,
//       secure: envConfig.SMTP_PORT === 465, 
//       auth: {
//         user: envConfig.SMTP_USER,
//         pass: envConfig.SMTP_PASS,
//       },
//     });
//   }

//   async sendOtpEmail(email: string, otp: string): Promise<void> {
//     await this.transporter.sendMail({
//       from: `"Byway" <${envConfig.SMTP_FROM}>`,
//       to: email,
//       subject: "Your Verification OTP",
//       text: `Your OTP is ${otp}. It expires in 10 minutes.`,
//       html: `<p>Your OTP is <b>${otp}</b>. It expires in 10 minutes.</p>`,
//     });
//   }

//   async sendResetTokenEmail(email: string, token: string): Promise<void> {
//     const frontendBaseUrl = (envConfig.FRONTEND_URL || '').split(',')[0].trim();
//     const resetUrl = `${frontendBaseUrl}/reset-password?token=${token}`;
//     await this.transporter.sendMail({
//       from: `"Byway" <${envConfig.SMTP_FROM}>`,
//       to: email,
//       subject: "Password Reset Request",
//       text: `Click the link to reset your password: ${resetUrl}. It expires in 10 minutes.`,
//       html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. The link expires in 10 minutes.</p>`,
//     });
//   }
// }
