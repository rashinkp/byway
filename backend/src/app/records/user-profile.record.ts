import { Gender } from "@prisma/client";

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
  gender?: Gender | null;
  createdAt: Date;
  updatedAt: Date;
} 