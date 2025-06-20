export interface CertificateDTO {
  id: string;
  userId: string;
  courseId: string;
  enrollmentId: string;
  certificateNumber: string;
  status: string;
  issuedAt: string | null;
  expiresAt: string | null;
  pdfUrl: string | null;
  metadata: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
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
  metadata?: Record<string, any>;
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