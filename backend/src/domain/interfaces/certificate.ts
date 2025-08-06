import { CertificateStatus } from "../enum/certificate-status.enum";


export interface CertificateProps {
  id: string;
  userId: string;
  courseId: string;
  enrollmentId: string;
  certificateNumber: string;
  status: CertificateStatus;
  issuedAt?: Date | null;
  expiresAt?: Date | null;
  pdfUrl?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}