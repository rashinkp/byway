import { EnrollmentProps } from "../interfaces/enrollment";

export class Enrollment {
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _courseId: string;
  private readonly _enrolledAt: Date;
  private readonly _orderItemId: string | null;
  private _accessStatus: "ACTIVE" | "BLOCKED" | "EXPIRED";
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  constructor(props: EnrollmentProps) {
    if (!props.userId) {
      throw new Error("User ID is required");
    }
    if (!props.courseId) {
      throw new Error("Course ID is required");
    }

    this._id = props.id;
    this._userId = props.userId;
    this._courseId = props.courseId;
    this._enrolledAt = props.enrolledAt;
    this._orderItemId = props.orderItemId ?? null;
    this._accessStatus = props.accessStatus;
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt ?? null;
  }

  setAccessStatus(status: "ACTIVE" | "BLOCKED" | "EXPIRED"): void {
    if (this._deletedAt) {
      throw new Error("Cannot change access status of a deleted enrollment");
    }
    if (this._accessStatus === status) {
      throw new Error(`Enrollment is already ${status}`);
    }
    this._accessStatus = status;
    this._updatedAt = new Date();
  }

  softDelete(): void {
    if (this._deletedAt) {
      throw new Error("Enrollment is already deleted");
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  recover(): void {
    if (!this._deletedAt) {
      throw new Error("Enrollment is not deleted");
    }
    this._deletedAt = null;
    this._updatedAt = new Date();
  }

  isActive(): boolean {
    return !this._deletedAt && this._accessStatus === "ACTIVE";
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

  get enrolledAt(): Date {
    return this._enrolledAt;
  }

  get orderItemId(): string | null {
    return this._orderItemId;
  }

  get accessStatus(): "ACTIVE" | "BLOCKED" | "EXPIRED" {
    return this._accessStatus;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }
}
