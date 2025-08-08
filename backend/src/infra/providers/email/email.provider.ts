import nodemailer, { Transporter } from "nodemailer";
import { envConfig } from "../../../presentation/express/configs/env.config";
import { EmailProvider } from "../../../app/providers/email.provider.interface";

export class EmailProviderImpl implements EmailProvider {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: envConfig.EMAIL_USER,
        pass: envConfig.EMAIL_PASS,
      },
    });
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f7f7fa; padding: 32px;">
        <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); padding: 32px 24px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #2d3748; margin: 0; font-size: 2rem;">Welcome to Byway!</h2>
            <p style="color: #4a5568; font-size: 1.1rem; margin: 8px 0 0;">Your eLearning journey starts here 🚀</p>
          </div>
          <div style="background: #f6e05e; color: #2d3748; border-radius: 8px; padding: 20px 0; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 1.1rem;">Your One-Time Password (OTP):</span>
            <div style="font-size: 2.5rem; font-weight: bold; letter-spacing: 6px; margin-top: 8px;">${otp}</div>
          </div>
          <p style="color: #4a5568; font-size: 1rem; text-align: center; margin-bottom: 24px;">
            Please enter this OTP to verify your email address. <br />
            <b>This code will expire in 10 minutes.</b>
          </p>
          <div style="text-align: center; color: #a0aec0; font-size: 0.95rem;">
            If you did not request this, you can safely ignore this email.<br />
            &copy; ${new Date().getFullYear()} Byway eLearning Platform
          </div>
        </div>
      </div>
    `;
    await this.transporter.sendMail({
      from: `Byway <${envConfig.EMAIL_USER}>`,
      to: email,
      subject: "Your Byway Email Verification Code",
      text: `Your Byway OTP is ${otp}. It expires in 10 minutes.`,
      html,
    });
  }

  async sendResetTokenEmail(email: string, token: string): Promise<void> {
    const frontendBaseUrl = (envConfig.FRONTEND_URL || "").split(",")[0].trim();
    const resetUrl = `${frontendBaseUrl}/reset-password?token=${token}`;
    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f7f7fa; padding: 32px;">
        <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); padding: 32px 24px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #2d3748; margin: 0; font-size: 2rem;">Reset Your Byway Password</h2>
          </div>
          <p style="color: #4a5568; font-size: 1rem; text-align: center; margin-bottom: 24px;">
            Click the button below to reset your password. This link will expire in 10 minutes.
          </p>
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${resetUrl}" style="background: #f6e05e; color: #2d3748; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-size: 1.1rem; font-weight: bold;">Reset Password</a>
          </div>
          <div style="text-align: center; color: #a0aec0; font-size: 0.95rem;">
            If you did not request this, you can safely ignore this email.<br />
            &copy; ${new Date().getFullYear()} Byway eLearning Platform
          </div>
        </div>
      </div>
    `;
    await this.transporter.sendMail({
      from: `Byway <${envConfig.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Byway Password",
      text: `Click the link to reset your password: ${resetUrl}. It expires in 10 minutes.
`,
      html,
    });
  }

  async sendContactFormEmail(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<void> {
    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f7f7fa; padding: 32px;">
        <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); padding: 32px 24px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #2d3748; margin: 0; font-size: 2rem;">New Contact Form Submission</h2>
            <p style="color: #4a5568; font-size: 1.1rem; margin: 8px 0 0;">Someone has contacted us through the website</p>
          </div>
          <div style="background: #f6e05e; color: #2d3748; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 16px 0; font-size: 1.2rem;">Contact Details</h3>
            <p style="margin: 8px 0;"><strong>Name:</strong> ${data.name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${data.email}</p>
            <p style="margin: 8px 0;"><strong>Subject:</strong> ${
              data.subject
            }</p>
          </div>
          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 16px 0; font-size: 1.2rem; color: #2d3748;">Message</h3>
            <p style="color: #4a5568; font-size: 1rem; line-height: 1.6; margin: 0; white-space: pre-wrap;">${
              data.message
            }</p>
          </div>
          <div style="text-align: center; color: #a0aec0; font-size: 0.95rem;">
            This message was sent from the Byway contact form.<br />
            &copy; ${new Date().getFullYear()} Byway eLearning Platform
          </div>
        </div>
      </div>
    `;
    await this.transporter.sendMail({
      from: `Byway Contact Form <${envConfig.EMAIL_USER}>`,
      to: envConfig.EMAIL_USER, // Send to admin/support email
      subject: `Contact Form: ${data.subject}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\n\nMessage:\n${data.message}`,
      html,
    });
  }

  async sendContactConfirmationEmail(data: {
    name: string;
    email: string;
    subject: string;
  }): Promise<void> {
    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f7f7fa; padding: 32px;">
        <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); padding: 32px 24px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #2d3748; margin: 0; font-size: 2rem;">Thank You for Contacting Us!</h2>
            <p style="color: #4a5568; font-size: 1.1rem; margin: 8px 0 0;">We've received your message</p>
          </div>
          <div style="background: #f6e05e; color: #2d3748; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 8px 0; font-size: 1.1rem;">Hi ${data.name},</p>
            <p style="margin: 8px 0; font-size: 1rem;">Thank you for reaching out to us. We've received your message about "<strong>${
              data.subject
            }</strong>" and will get back to you within 24 hours.</p>
          </div>
          <p style="color: #4a5568; font-size: 1rem; text-align: center; margin-bottom: 24px;">
            In the meantime, you can check out our <a href="${
              envConfig.FRONTEND_URL
            }/courses" style="color: #f6e05e;">course catalog</a> or visit our <a href="${
      envConfig.FRONTEND_URL
    }/contact" style="color: #f6e05e;">FAQ section</a> for quick answers.
          </p>
          <div style="text-align: center; color: #a0aec0; font-size: 0.95rem;">
            &copy; ${new Date().getFullYear()} Byway eLearning Platform
          </div>
        </div>
      </div>
    `;
    await this.transporter.sendMail({
      from: `Byway Support <${envConfig.EMAIL_USER}>`,
      to: data.email,
      subject: "We've received your message - Byway",
      text: `Hi ${data.name},\n\nThank you for contacting us. We've received your message about "${data.subject}" and will get back to you within 24 hours.\n\nBest regards,\nThe Byway Team`,
      html,
    });
  }
}
