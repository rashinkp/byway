import { CertificateStatus } from "@prisma/client";

export interface CertificateRecord {
  id: string;
  userId: string;
  courseId: string;
  enrollmentId: string;
  certificateNumber: string;
  status: CertificateStatus;
  issuedAt?: Date | null;
  expiresAt?: Date | null;
  pdfUrl?: string | null;
  metadata?: any | null;
  createdAt: Date;
  updatedAt: Date;
} 