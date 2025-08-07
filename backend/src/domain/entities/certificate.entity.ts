import { CertificateStatus } from "../enum/certificate-status.enum";

export interface CertificateProps {
  id: string; // Now mandatory
  userId: string;
  courseId: string;
  enrollmentId: string;
  certificateNumber: string;
  status?: CertificateStatus;
  issuedAt?: Date | null;
  expiresAt?: Date | null;
  pdfUrl?: string | null;
  metadata?: Record<string, any> | null;
  createdAt?: Date;
  updatedAt?: Date;
}

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
    if (!props.id || props.id.trim() === "") {
      throw new Error("Certificate ID is required");
    }
    this._id = props.id;
    this._userId = props.userId;
    this._courseId = props.courseId;
    this._enrollmentId = props.enrollmentId;
    this._certificateNumber = props.certificateNumber;
    this._status = props.status ?? CertificateStatus.PENDING;
    this._issuedAt = props.issuedAt ?? null;
    this._expiresAt = props.expiresAt ?? null;
    this._pdfUrl = props.pdfUrl ?? null;
    this._metadata = props.metadata ?? null;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
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

  // Factory method - creates a certificate; requires id explicitly
  public static create(props: CertificateProps): Certificate {
    if (!props.id || props.id.trim() === "") {
      throw new Error("Certificate ID is required");
    }
    return new Certificate({
      ...props,
      status: props.status ?? CertificateStatus.PENDING,
    });
  }

  // Factory method for rebuilding from persistence
  public static fromPersistence(data: CertificateProps): Certificate {
    return new Certificate({
      ...data,
      issuedAt: data.issuedAt ? new Date(data.issuedAt) : null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    });
  }

  // Business logic methods
  public generateCertificate(
    pdfUrl: string,
    metadata?: Record<string, any>
  ): void {
    this._status = CertificateStatus.GENERATED;
    this._pdfUrl = pdfUrl;
    this._metadata = metadata ?? this._metadata;
    this._updatedAt = new Date();
  }

  public issueCertificate(): void {
    this._status = CertificateStatus.ISSUED;
    this._issuedAt = new Date();
    this._updatedAt = new Date();
  }

  public setExpiryDate(expiresAt: Date): void {
    this._expiresAt = expiresAt;
    this._updatedAt = new Date();
  }

  public revokeCertificate(): void {
    this._status = CertificateStatus.REVOKED;
    this._updatedAt = new Date();
  }

  public isExpired(): boolean {
    if (!this._expiresAt) return false;
    return new Date() > this._expiresAt;
  }

  public isIssued(): boolean {
    return this._status === CertificateStatus.ISSUED;
  }

  public isRevoked(): boolean {
    return this._status === CertificateStatus.REVOKED;
  }

  public canBeIssued(): boolean {
    return this._status === CertificateStatus.GENERATED && !this.isExpired();
  }

  // Convert entity to plain object for serialization or persistence
  public toJSON(): CertificateProps {
    return {
      id: this._id,
      userId: this._userId,
      courseId: this._courseId,
      enrollmentId: this._enrollmentId,
      certificateNumber: this._certificateNumber,
      status: this._status,
      issuedAt: this._issuedAt,
      expiresAt: this._expiresAt,
      pdfUrl: this._pdfUrl,
      metadata: this._metadata,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
