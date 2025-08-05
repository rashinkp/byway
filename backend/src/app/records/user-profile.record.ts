export interface UserProfileRecord {
  id: string;
  userId: string;
  bio?: string | null;
  education?: string | null;
  skills?: string | null;
  phoneNumber?: string | null;
  country?: string | null;
  city?: string | null;
  address?: string | null;
  dateOfBirth?: Date | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  createdAt: Date;
  updatedAt: Date;
} 