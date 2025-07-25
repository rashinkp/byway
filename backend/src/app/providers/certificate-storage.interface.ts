export interface CertificateStorageServiceInterface {
  uploadCertificate(pdfBuffer: Buffer, certificateNumber: string): Promise<string>;
  deleteCertificate(certificateUrl: string): Promise<void>; 
} 