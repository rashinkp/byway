import { CertificateStatus } from "../enum/certificate-status.enum";

// Certificate metadata structure - moved to domain layer
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

export interface CertificateProps {
  id?: string; 
  userId: string;
  courseId: string;
  enrollmentId: string;
  certificateNumber: string;
  status?: CertificateStatus;
  issuedAt?: Date | null;
  expiresAt?: Date | null;
  pdfUrl?: string | null;
  metadata?: CertificateMetadata | null;
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
  private _metadata: CertificateMetadata | null;
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

  get metadata(): CertificateMetadata | null {
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

  // Business logic methods
  public generateCertificate(
    pdfUrl: string,
    metadata?: CertificateMetadata
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

  public static toDomain(raw: {
    id: string;
    userId: string;
    courseId: string;
    enrollmentId: string;
    certificateNumber: string;
    status: string;
    issuedAt?: Date | null;
    expiresAt?: Date | null;
    pdfUrl?: string | null;
    metadata?: CertificateMetadata;
    createdAt: Date;
    updatedAt: Date;
  }): Certificate {
    return new Certificate({
      id: raw.id,
      userId: raw.userId,
      courseId: raw.courseId,
      enrollmentId: raw.enrollmentId,
      certificateNumber: raw.certificateNumber,
      status: raw.status as CertificateStatus,
      issuedAt: raw.issuedAt ?? null,
      expiresAt: raw.expiresAt ?? null,
      pdfUrl: raw.pdfUrl ?? null,
      metadata: raw.metadata ?? null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(certificate: Certificate): Record<string, unknown> {
    return {
      id: certificate.id,
      userId: certificate.userId,
      courseId: certificate.courseId,
      enrollmentId: certificate.enrollmentId,
      certificateNumber: certificate.certificateNumber,
      status: certificate.status,
      issuedAt: certificate.issuedAt,
      expiresAt: certificate.expiresAt,
      pdfUrl: certificate.pdfUrl,
      metadata: certificate.metadata,
      createdAt: certificate.createdAt,
      updatedAt: certificate.updatedAt,
    };
  }
}
