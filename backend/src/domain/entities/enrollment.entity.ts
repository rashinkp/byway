export class Enrollment {
  private readonly _id: string;
  private _userId: string;
  private _courseId: string;
  private _enrolledAt: Date;
  private _orderItemId?: string;
  private _accessStatus: 'ACTIVE' | 'BLOCKED' | 'EXPIRED';

  constructor(props: {
    id: string;
    userId: string;
    courseId: string;
    enrolledAt: Date;
    orderItemId?: string;
    accessStatus?: 'ACTIVE' | 'BLOCKED' | 'EXPIRED';
  }) {
    this.validateEnrollment(props);
    
    this._id = props.id;
    this._userId = props.userId;
    this._courseId = props.courseId;
    this._enrolledAt = props.enrolledAt;
    this._orderItemId = props.orderItemId;
    this._accessStatus = props.accessStatus ?? 'ACTIVE';
  }

  private validateEnrollment(props: any): void {
    if (!props.id) {
      throw new Error("Enrollment ID is required");
    }

    if (!props.userId) {
      throw new Error("User ID is required");
    }

    if (!props.courseId) {
      throw new Error("Course ID is required");
    }

    if (!props.enrolledAt) {
      throw new Error("Enrollment date is required");
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

  get enrolledAt(): Date {
    return this._enrolledAt;
  }

  get orderItemId(): string | undefined {
    return this._orderItemId;
  }

  get accessStatus(): 'ACTIVE' | 'BLOCKED' | 'EXPIRED' {
    return this._accessStatus;
  }

  // Business logic methods
  blockAccess(): void {
    this._accessStatus = 'BLOCKED';
  }

  activateAccess(): void {
    this._accessStatus = 'ACTIVE';
  }

  expireAccess(): void {
    this._accessStatus = 'EXPIRED';
  }

  isActive(): boolean {
    return this._accessStatus === 'ACTIVE';
  }

  isBlocked(): boolean {
    return this._accessStatus === 'BLOCKED';
  }

  isExpired(): boolean {
    return this._accessStatus === 'EXPIRED';
  }

  hasOrderItem(): boolean {
    return this._orderItemId !== undefined;
  }
} 