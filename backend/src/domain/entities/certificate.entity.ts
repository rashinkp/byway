import { CertificateStatus } from "../enum/certificate-status.enum";

export class Certificate {
  private readonly _id: string;
  private _userId: string;
  private _courseId: string;
  private _enrollmentId: string;
  private _certificateNumber: string;
  private _status: CertificateStatus;
  private _issuedAt: Date | null;
  private _expiresAt: Date | null;
  private _pdfUrl: string | null;
  private _metadata: Record<string, any> | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: {
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
  }) {
    this.validateCertificate(props);
    
    this._id = props.id;
    this._userId = props.userId;
    this._courseId = props.courseId;
    this._enrollmentId = props.enrollmentId;
    this._certificateNumber = props.certificateNumber;
    this._status = props.status;
    this._issuedAt = props.issuedAt ?? null;
    this._expiresAt = props.expiresAt ?? null;
    this._pdfUrl = props.pdfUrl ?? null;
    this._metadata = props.metadata ?? null;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  private validateCertificate(props: any): void {
    if (!props.id) {
      throw new Error("Certificate ID is required");
    }

    if (!props.userId) {
      throw new Error("User ID is required");
    }

    if (!props.courseId) {
      throw new Error("Course ID is required");
    }

    if (!props.enrollmentId) {
      throw new Error("Enrollment ID is required");
    }

    if (!props.certificateNumber || props.certificateNumber.trim() === "") {
      throw new Error("Certificate number is required");
    }

    if (!props.status) {
      throw new Error("Certificate status is required");
    }

    if (props.expiresAt && props.issuedAt && props.expiresAt <= props.issuedAt) {
      throw new Error("Expiry date must be after issue date");
    }
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get courseId(): string {
    return this._courseId;
  }

  get enrollmentId(): string {
    return this._enrollmentId;
  }

  get certificateNumber(): string {
    return this._certificateNumber;
  }

  get status(): CertificateStatus {
    return this._status;
  }

  get issuedAt(): Date | null {
    return this._issuedAt;
  }

  get expiresAt(): Date | null {
    return this._expiresAt;
  }

  get pdfUrl(): string | null {
    return this._pdfUrl;
  }

  get metadata(): Record<string, any> | null {
    return this._metadata;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business logic methods
  generateCertificate(pdfUrl: string, metadata?: Record<string, any>): void {
    if (!pdfUrl || pdfUrl.trim() === "") {
      throw new Error("PDF URL is required");
    }
    
    this._pdfUrl = pdfUrl;
    this._metadata = metadata ?? null;
    this._updatedAt = new Date();
  }

  issueCertificate(): void {
    if (this._status === CertificateStatus.ISSUED) {
      throw new Error("Certificate is already issued");
    }
    
    this._status = CertificateStatus.ISSUED;
    this._issuedAt = new Date();
    this._updatedAt = new Date();
  }

  setExpiryDate(expiresAt: Date): void {
    if (this._issuedAt && expiresAt <= this._issuedAt) {
      throw new Error("Expiry date must be after issue date");
    }
    
    this._expiresAt = expiresAt;
    this._updatedAt = new Date();
  }

  revokeCertificate(): void {
    this._status = CertificateStatus.REVOKED;
    this._updatedAt = new Date();
  }

  isExpired(): boolean {
    return this._expiresAt !== null && this._expiresAt < new Date();
  }

  isIssued(): boolean {
    return this._status === CertificateStatus.ISSUED;
  }

  isRevoked(): boolean {
    return this._status === CertificateStatus.REVOKED;
  }

  canBeIssued(): boolean {
    return this._status === CertificateStatus.PENDING;
  }

  hasPdf(): boolean {
    return this._pdfUrl !== null && this._pdfUrl.trim() !== "";
  }

  hasExpiryDate(): boolean {
    return this._expiresAt !== null;
  }
} 