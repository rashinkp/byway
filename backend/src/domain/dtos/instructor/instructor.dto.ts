import { APPROVALSTATUS } from "../../enum/approval-status.enum";
import { Role } from "../../enum/role.enum";

export interface CreateInstructorRequestDTO {
  areaOfExpertise: string;
  professionalExperience: string;
  about?: string;
  website?: string;
  education: string;
  certifications: string;
  cv: string;
}

export interface UpdateInstructorRequestDTO {
  id: string;
  areaOfExpertise?: string;
  professionalExperience?: string;
  about?: string;
  website?: string;
  education?: string;
  certifications?: string;
  cv?: string;
  status?: APPROVALSTATUS;
}

export interface ApproveInstructorRequestDTO {
  instructorId: string;
}

export interface DeclineInstructorRequestDTO {
  instructorId: string;
}

export interface GetInstructorByUserIdRequestDTO {
  userId: string;
}

export interface GetAllInstructorsRequestDTO {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filterBy?: "All" | "Pending" | "Approved" | "Declined";
  includeDeleted?: boolean;
  user?: {
    id: string;
    role: Role;
  };
}

export interface InstructorResponseDTO {
  id: string;
  userId: string;
  areaOfExpertise: string;
  professionalExperience: string;
  about?: string;
  website?: string;
  education: string;
  certifications: string;
  cv: string;
  status: APPROVALSTATUS;
  totalStudents: number;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatar?: string;
  };
}

export interface PublicInstructorResponseDTO {
  id: string;
  userId: string;
  areaOfExpertise: string;
  about?: string;
  website?: string;
  education: string;
  certifications: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}
