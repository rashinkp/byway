import { CertificateStatus } from "../enum/certificate-status.enum";
import { CertificateProps } from "../interfaces/certificate";


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

  constructor(props: CertificateProps) {
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
      throw new Error("Certificate number is required and cannot be empty");
    }

    this._id = props.id;
    this._userId = props.userId;
    this._courseId = props.courseId;
    this._enrollmentId = props.enrollmentId;
    this._certificateNumber = props.certificateNumber.trim();
    this._status = props.status;
    this._issuedAt = props.issuedAt ?? null;
    this._expiresAt = props.expiresAt ?? null;
    this._pdfUrl = props.pdfUrl ?? null;
    this._metadata = props.metadata ?? null;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  generateCertificate(pdfUrl: string, metadata?: Record<string, any>): void {
    if (!pdfUrl) {
      throw new Error("PDF URL is required");
    }
    this._status = CertificateStatus.GENERATED;
    this._pdfUrl = pdfUrl;
    this._metadata = metadata ?? this._metadata;
    this._updatedAt = new Date();
  }

  issueCertificate(): void {
    if (this._status !== CertificateStatus.GENERATED) {
      throw new Error("Certificate must be generated before issuing");
    }
    if (this.isExpired()) {
      throw new Error("Cannot issue an expired certificate");
    }
    this._status = CertificateStatus.ISSUED;
    this._issuedAt = new Date();
    this._updatedAt = new Date();
  }

  setExpiryDate(expiresAt: Date): void {
    if (expiresAt <= new Date()) {
      throw new Error("Expiry date must be in the future");
    }
    this._expiresAt = expiresAt;
    this._updatedAt = new Date();
  }

  revokeCertificate(): void {
    if (this._status !== CertificateStatus.ISSUED) {
      throw new Error("Only issued certificates can be revoked");
    }
    this._status = CertificateStatus.REVOKED;
    this._updatedAt = new Date();
  }

  isExpired(): boolean {
    if (!this._expiresAt) return false;
    return new Date() > this._expiresAt;
  }

  isIssued(): boolean {
    return this._status === CertificateStatus.ISSUED;
  }

  isRevoked(): boolean {
    return this._status === CertificateStatus.REVOKED;
  }

  canBeIssued(): boolean {
    return this._status === CertificateStatus.GENERATED && !this.isExpired();
  }

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
}
