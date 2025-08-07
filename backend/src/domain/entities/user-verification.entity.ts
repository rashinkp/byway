interface UserVerificationProps {
  id: string;
  userId: string;
  email: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
  isUsed: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export class UserVerification {
  private _id: string;
  private _userId: string;
  private _email: string;
  private _otp: string;
  private _expiresAt: Date;
  private _attempts: number;
  private _isUsed: boolean;
  private _createdAt: Date;
  private _updatedAt?: Date;

  private constructor(props: UserVerificationProps) {
    this._id = props.id;
    this._userId = props.userId;
    this._email = props.email;
    this._otp = props.otp;
    this._expiresAt = props.expiresAt;
    this._attempts = props.attempts;
    this._isUsed = props.isUsed;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  // Create method with explicit parameters or a params object (choose one style)
  static create(params: {
    id: string;
    userId: string;
    email: string;
    otp: string;
    expiresAt: Date;
    attempts?: number;
    isUsed?: boolean;
    createdAt?: Date;
  }): UserVerification {
    const {
      id,
      userId,
      email,
      otp,
      expiresAt,
      attempts = 0,
      isUsed = false,
      createdAt = new Date(),
    } = params;

    if (!id) {
      throw new Error("Verification ID is required");
    }
    if (!userId) {
      throw new Error("User ID is required");
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Valid email is required");
    }
    if (!otp || otp.length < 6) {
      throw new Error("OTP must be at least 6 characters");
    }
    if (!expiresAt || expiresAt <= new Date()) {
      throw new Error("Valid future expiration date is required");
    }
    if (attempts < 0) {
      throw new Error("Attempts cannot be negative");
    }

    return new UserVerification({
      id,
      userId,
      email,
      otp,
      expiresAt,
      attempts,
      isUsed,
      createdAt,
    });
  }

  static fromPrisma(data: {
    id: string;
    userId: string;
    email: string;
    otp: string;
    expiresAt: Date;
    attemptCount: number;
    isUsed: boolean;
    createdAt: Date;
    updatedAt?: Date;
  }): UserVerification {
    return new UserVerification({
      id: data.id,
      userId: data.userId,
      email: data.email,
      otp: data.otp,
      expiresAt: data.expiresAt,
      attempts: data.attemptCount,
      isUsed: data.isUsed,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get email(): string {
    return this._email;
  }

  get otp(): string {
    return this._otp;
  }

  get expiresAt(): Date {
    return this._expiresAt;
  }

  get attempts(): number {
    return this._attempts;
  }

  get isUsed(): boolean {
    return this._isUsed;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  // Business logic methods
  incrementAttempts(): void {
    this._attempts += 1;
    this._updatedAt = new Date();
  }

  markAsUsed(): void {
    this._isUsed = true;
    this._updatedAt = new Date();
  }

  isExpired(): boolean {
    return this._expiresAt <= new Date();
  }

  verify(otp: string): void {
    if (this.isExpired()) {
      throw new Error("OTP has expired");
    }
    if (this._isUsed) {
      throw new Error("OTP has already been used");
    }
    if (this._attempts >= 3) {
      throw new Error("Maximum attempts exceeded");
    }
    if (this._otp !== otp) {
      this.incrementAttempts();
      throw new Error("Invalid OTP");
    }
    this.markAsUsed();
  }
}
