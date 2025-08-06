import { UserVerification } from "../../domain/entities/user-verification.entity";
import { UserVerificationRecord } from "../records/user-verification.record";

export class UserVerificationMapper {
  // Record to Domain Entity
  static toDomain(record: UserVerificationRecord): UserVerification {
    return new UserVerification({
      id: record.id,
      userId: record.userId,
      email: record.email,
      otp: record.otp,
      expiresAt: record.expiresAt,
      attempts: record.attempts,
      isUsed: record.isUsed,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  // Domain Entity to Record
  static toRecord(verification: UserVerification): UserVerificationRecord {
    return {
      id: verification.id,
      userId: verification.userId,
      email: verification.email,
      otp: verification.otp,
      expiresAt: verification.expiresAt,
      attempts: verification.attempts,
      isUsed: verification.isUsed,
      createdAt: verification.createdAt,
      updatedAt: verification.updatedAt,
    };
  }
}