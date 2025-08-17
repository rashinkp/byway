// Certificate metadata structure - matches backend domain layer
export interface CertificateMetadata {
  completionStats?: {
    completionDate: string;
    instructorName?: string;
    totalLessons: number;
    completedLessons: number;
    averageScore: number;
  };
  generatedAt?: string;
  [key: string]: unknown; // Allow for future extensibility
}

// Certificate status enum - matches backend domain layer
export enum CertificateStatus {
  PENDING = 'PENDING',
  GENERATED = 'GENERATED',
  ISSUED = 'ISSUED',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED'
}

export interface CertificateDTO {
	id: string;
	userId: string;
	courseId: string;
	enrollmentId?: string;
	certificateNumber: string;
	status: CertificateStatus;
	issuedAt: string | null;
	expiresAt: string | null;
	pdfUrl: string;
	metadata?: CertificateMetadata;
	createdAt: string;
	updatedAt: string;
	courseTitle?: string;
	userName?: string;
	userEmail?: string;
	completionDate?: string;
	averageScore?: number;
	instructorName?: string;
}
