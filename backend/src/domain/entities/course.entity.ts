import { CourseLevel } from "../enum/course-level.enum";
import { Price } from "../value-object/price";
import { Duration } from "../value-object/duration";
import { Offer } from "../value-object/offer";
import { CourseStatus } from "../enum/course-status.enum";
import { APPROVALSTATUS } from "../enum/approval-status.enum";
import { CourseProps } from "../interfaces/course";

export class CourseDetails {
  private readonly _prerequisites: string | null;
  private readonly _longDescription: string | null;
  private readonly _objectives: string | null;
  private readonly _targetAudience: string | null;

  constructor(props: {
    prerequisites?: string | null;
    longDescription?: string | null;
    objectives?: string | null;
    targetAudience?: string | null;
  }) {
    this._prerequisites = props.prerequisites
      ? props.prerequisites.trim()
      : null;
    this._longDescription = props.longDescription
      ? props.longDescription.trim()
      : null;
    this._objectives = props.objectives ? props.objectives.trim() : null;
    this._targetAudience = props.targetAudience
      ? props.targetAudience.trim()
      : null;
  }

  get prerequisites(): string | null {
    return this._prerequisites;
  }

  get longDescription(): string | null {
    return this._longDescription;
  }

  get objectives(): string | null {
    return this._objectives;
  }

  get targetAudience(): string | null {
    return this._targetAudience;
  }
}



export class Course {
  private readonly _id: string;
  private readonly _title: string;
  private readonly _description: string | null;
  private readonly _level: CourseLevel;
  private readonly _price: Price | null;
  private readonly _thumbnail: string | null;
  private readonly _duration: Duration | null;
  private readonly _offer: Offer | null;
  private readonly _status: CourseStatus;
  private readonly _categoryId: string;
  private readonly _createdBy: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;
  private _approvalStatus: APPROVALSTATUS;
  private readonly _adminSharePercentage: number;
  private readonly _details: CourseDetails | null;
  private readonly _rating?: number;
  private readonly _reviewCount?: number;
  private readonly _lessons?: number;
  private readonly _bestSeller?: boolean;

  constructor(props: CourseProps) {
    if (!props.title || props.title.trim() === "") {
      throw new Error("Course title is required and cannot be empty");
    }
    if (!props.categoryId) {
      throw new Error("Category ID is required");
    }
    if (!props.createdBy) {
      throw new Error("Creator ID is required");
    }
    if (props.adminSharePercentage < 0 || props.adminSharePercentage > 100) {
      throw new Error("Admin share percentage must be between 0 and 100");
    }
    if (props.rating && (props.rating < 0 || props.rating > 5)) {
      throw new Error("Rating must be between 0 and 5");
    }
    if (props.reviewCount && props.reviewCount < 0) {
      throw new Error("Review count cannot be negative");
    }
    if (props.lessons && props.lessons < 0) {
      throw new Error("Lesson count cannot be negative");
    }

    this._id = props.id;
    this._title = props.title.trim();
    this._description = props.description ? props.description.trim() : null;
    this._level = props.level;
    this._price = props.price ?? null;
    this._thumbnail = props.thumbnail ?? null;
    this._duration = props.duration ?? null;
    this._offer = props.offer ?? null;
    this._status = props.status;
    this._categoryId = props.categoryId;
    this._createdBy = props.createdBy;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt ?? null;
    this._approvalStatus = props.approvalStatus;
    this._adminSharePercentage = props.adminSharePercentage;
    this._details = props.details ?? null;
    this._rating = props.rating;
    this._reviewCount = props.reviewCount;
    this._lessons = props.lessons;
    this._bestSeller = props.bestSeller;
  }

  setApprovalStatus(status: APPROVALSTATUS): void {
    if (this._approvalStatus === status) {
      throw new Error(`Course is already ${status}`);
    }
    if (this._deletedAt) {
      throw new Error("Cannot change approval status of a deleted course");
    }
    this._approvalStatus = status;
    this._updatedAt = new Date();
  }

  softDelete(): void {
    if (this._deletedAt) {
      throw new Error("Course is already deleted");
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  recover(): void {
    if (!this._deletedAt) {
      throw new Error("Course is not deleted");
    }
    this._deletedAt = null;
    this._updatedAt = new Date();
  }

  isActive(): boolean {
    return !this._deletedAt;
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get description(): string | null {
    return this._description;
  }

  get level(): CourseLevel {
    return this._level;
  }

  get price(): Price | null {
    return this._price;
  }

  get thumbnail(): string | null {
    return this._thumbnail;
  }

  get duration(): Duration | null {
    return this._duration;
  }

  get offer(): Offer | null {
    return this._offer;
  }

  get status(): CourseStatus {
    return this._status;
  }

  get categoryId(): string {
    return this._categoryId;
  }

  get createdBy(): string {
    return this._createdBy;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  get approvalStatus(): APPROVALSTATUS {
    return this._approvalStatus;
  }

  get adminSharePercentage(): number {
    return this._adminSharePercentage;
  }

  get details(): CourseDetails | null {
    return this._details;
  }

  get rating(): number | undefined {
    return this._rating;
  }

  get reviewCount(): number | undefined {
    return this._reviewCount;
  }

  get lessons(): number | undefined {
    return this._lessons;
  }

  get bestSeller(): boolean | undefined {
    return this._bestSeller;
  }
}
