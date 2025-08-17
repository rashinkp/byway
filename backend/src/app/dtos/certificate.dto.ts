import { CertificateMetadata } from "../../domain/entities/certificate.entity";
import { CertificateStatus } from "../../domain/enum/certificate-status.enum";

export interface CertificateDTO {
  id: string;
  userId: string;
  courseId: string;
  enrollmentId: string;
  certificateNumber: string;
  status: CertificateStatus;
  issuedAt: Date | null;
  expiresAt: Date | null;
  pdfUrl: string | null;
    metadata: CertificateMetadata | null;
    createdAt: Date;
  updatedAt: Date;
}

export interface CreateCertificateDTO {
  userId: string;
  courseId: string;
  enrollmentId: string;
  certificateNumber: string;
}

export interface GenerateCertificateDTO {
  certificateId: string;
  pdfUrl: string;
  metadata?: CertificateMetadata;
}

export interface IssueCertificateDTO {
  certificateId: string;
  expiresAt?: string;
}

export interface CertificateVerificationDTO {
  certificateNumber: string;
  userId?: string;
  courseId?: string;
}

export interface CertificateWithDetailsDTO extends CertificateDTO {
  courseTitle?: string;
  userName?: string;
  userEmail?: string;
  completionDate?: string;
  totalLessons?: number;
  completedLessons?: number;
  averageScore?: number;
} 

export interface GenerateCertificateInputDto {
  userId: string;
  courseId: string;
}

export interface GenerateCertificateOutputDto {
  success: boolean;
  certificate?: CertificateDTO;
  error?: string;
}
