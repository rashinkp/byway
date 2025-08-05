export interface CertificateRecord {
  id: string;
  userId: string;
  courseId: string;
  enrollmentId: string;
  certificateNumber: string;
  status: "PENDING" | "ISSUED" | "REVOKED";
  issuedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
} 