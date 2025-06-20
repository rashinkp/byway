
export interface CertificateTemplateData {
  certificateNumber: string;
  studentName: string;
  courseTitle: string;
  completionDate: string;
  instructorName?: string;
  totalLessons?: number;
  completedLessons?: number;
  averageScore?: number;
  platformName?: string;
  issuedDate: string;
}

export interface CertificatePdfServiceInterface {
  generateCertificatePDF(data: CertificateTemplateData): Promise<Buffer>;
  generateCertificatePDFStream(data: CertificateTemplateData): PDFKit.PDFDocument;
} 