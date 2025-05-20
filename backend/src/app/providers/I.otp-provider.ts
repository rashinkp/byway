import { UserVerification } from "../../domain/entities/user-verification.entity";

export interface IOtpProvider {
  generateOtp(
    email: string,
    userId: string,
    type: "VERIFICATION" | "RESET"
  ): Promise<UserVerification>;
}
