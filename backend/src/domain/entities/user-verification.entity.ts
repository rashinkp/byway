export class UserVerification {
  private readonly _id: string;
  private _userId: string;
  private _email: string;
  private _otp: string;
  private _expiresAt: Date;
  private _attempts: number;
  private _isUsed: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: {
    id: string;
    userId: string;
    email: string;
    otp: string;
    expiresAt: Date;
    attempts: number;
    isUsed: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.validateUserVerification(props);
    
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

  private validateUserVerification(props: any): void {
    if (!props.id) {
      throw new Error("Verification ID is required");
    }

    if (!props.userId) {
      throw new Error("User ID is required");
    }

    if (!props.email || !this.isValidEmail(props.email)) {
      throw new Error("Valid email is required");
    }

    if (!props.otp || props.otp.length < 6) {
      throw new Error("OTP must be at least 6 characters");
    }

    if (!props.expiresAt || props.expiresAt <= new Date()) {
      throw new Error("Valid future expiration date is required");
    }

    if (props.attempts < 0) {
      throw new Error("Attempts cannot be negative");
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business logic methods
  incrementAttempts(): void {
    this._attempts++;
    this._updatedAt = new Date();
  }

  markAsUsed(): void {
    if (this._isUsed) {
      throw new Error("Verification is already used");
    }
    this._isUsed = true;
    this._updatedAt = new Date();
  }

  isExpired(): boolean {
    return new Date() > this._expiresAt;
  }

  verify(otp: string): boolean {
    if (this._isUsed) {
      throw new Error("Verification is already used");
    }

    if (this.isExpired()) {
      throw new Error("Verification has expired");
    }

    if (this._attempts >= 3) {
      throw new Error("Maximum attempts exceeded");
    }

    this.incrementAttempts();

    if (this._otp === otp) {
      this.markAsUsed();
      return true;
    }

    return false;
  }

  canAttempt(): boolean {
    return !this._isUsed && !this.isExpired() && this._attempts < 3;
  }

  getRemainingAttempts(): number {
    return Math.max(0, 3 - this._attempts);
  }

  getTimeUntilExpiry(): number {
    const now = new Date();
    const diffTime = this._expiresAt.getTime() - now.getTime();
    return Math.max(0, diffTime);
  }
}
