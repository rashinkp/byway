import { UserProfile } from "../../../../domain/entities/user-profile.entity";
import { User } from "../../../../domain/entities/user.entity";
import { ProfileDTO, UserResponseDTO } from "../../../dtos/user.dto";

export function mapProfileToDTO(profile: UserProfile | null): ProfileDTO | null {
  if (!profile) return null;
  
  return {
    id: profile.id,
    userId: profile.userId,
    bio: profile.bio,
    education: profile.education,
    skills: profile.skills,
    phoneNumber: profile.phoneNumber,
    country: profile.country,
    city: profile.city,
    address: profile.address,
    dateOfBirth: profile.dateOfBirth,
    gender: profile.gender,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

export function mapUserToDTO(user: User | null): UserResponseDTO | null {
  if (!user) return null;
  
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    authProvider: user.authProvider,
    isVerified: user.isVerified,
    avatar: user.avatar,
    deletedAt: user.deletedAt,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt,
  };
}
