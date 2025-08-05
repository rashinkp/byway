import { UserProfile } from "../../domain/entities/user-profile.entity";
import { UserProfileRecord } from "../records/user-profile.record";

export class UserProfileMapper {
  static toDomain(record: UserProfileRecord): UserProfile {
    return new UserProfile({
      id: record.id,
      userId: record.userId,
      bio: record.bio || undefined,
      education: record.education || undefined,
      skills: record.skills || undefined,
      phoneNumber: record.phoneNumber || undefined,
      country: record.country || undefined,
      city: record.city || undefined,
      address: record.address || undefined,
      dateOfBirth: record.dateOfBirth || undefined,
      gender: record.gender || undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toRecord(profile: UserProfile): UserProfileRecord {
    return {
      id: profile.id,
      userId: profile.userId,
      bio: profile.bio || null,
      education: profile.education || null,
      skills: profile.skills || null,
      phoneNumber: profile.phoneNumber || null,
      country: profile.country || null,
      city: profile.city || null,
      address: profile.address || null,
      dateOfBirth: profile.dateOfBirth || null,
      gender: profile.gender as any || null,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
} 