import { APPROVALSTATUS, Role } from "@prisma/client";

export interface BaseInstructorDetails {
  areaOfExpertise: string;
  professionalExperience: string;
  about: string | null;
  userId: string;
  website?: string | null;
  status?: APPROVALSTATUS;
}

export type CreateInstructorInput = BaseInstructorDetails;

export interface IInstructorDetails extends BaseInstructorDetails {
  id: string;
  status: APPROVALSTATUS;
}

export interface IUserDetails {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInstructor extends IInstructorDetails {
  email: string;
  role: Role;
}

export type InstructorWithToken = IInstructor & { newToken: string };

// Combined user and instructor details (reused for both getInstructorByUserId and findAllInstructors)
export interface IInstructorWithUserDetails {
  instructor: IInstructorDetails | null;
  user: IUserDetails;
}

export interface UpdateInstructorStatusInput {
  instructorId: string;
  status: APPROVALSTATUS;
}