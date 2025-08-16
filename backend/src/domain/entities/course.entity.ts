import { CourseLevel } from "../enum/course-level.enum";
import { Price } from "../value-object/price";
import { Duration } from "../value-object/duration";
import { Offer } from "../value-object/offer";
import { CourseStatus } from "../enum/course-status.enum";
import { APPROVALSTATUS } from "../enum/approval-status.enum";

export class CourseDetails {
  private _prerequisites: string | null;
  private _longDescription: string | null;
  private _objectives: string | null;
  private _targetAudience: string | null;

  constructor(props: {
    prerequisites?: string | null;
    longDescription?: string | null;
    objectives?: string | null;
    targetAudience?: string | null;
  }) {
    this._prerequisites = props.prerequisites ?? null;
    this._longDescription = props.longDescription ?? null;
    this._objectives = props.objectives ?? null;
    this._targetAudience = props.targetAudience ?? null;
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

  update(
    props: Partial<{
      prerequisites: string | null;
      longDescription: string | null;
      objectives: string | null;
      targetAudience: string | null;
    }>
  ): void {
    if (props.prerequisites !== undefined)
      this._prerequisites = props.prerequisites;
    if (props.longDescription !== undefined)
      this._longDescription = props.longDescription;
    if (props.objectives !== undefined) this._objectives = props.objectives;
    if (props.targetAudience !== undefined)
      this._targetAudience = props.targetAudience;
  }

  toJSON() {
    return {
      prerequisites: this._prerequisites,
      longDescription: this._longDescription,
      objectives: this._objectives,
      targetAudience: this._targetAudience,
    };
  }
}

export interface CourseProps {
  id: string; // now mandatory
  title: string;
  description?: string | null;
  level: CourseLevel;
  price?: Price | null;
  thumbnail?: string | null;
  duration?: Duration | null;
  offer?: Offer | null;
  status: CourseStatus;
  categoryId: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  approvalStatus?: APPROVALSTATUS;
  adminSharePercentage?: number;
  details?: CourseDetails | null;
  rating?: number;
  reviewCount?: number;
  lessons?: number;
  bestSeller?: boolean;
}

export class Course {
  private readonly _id: string;
  private _title: string;
  private _description: string | null;
  private _level: CourseLevel;
  private _price: Price | null;
  private _thumbnail: string | null;
  private _duration: Duration | null;
  private _offer: Offer | null;
  private _status: CourseStatus;
  private _categoryId: string;
  private _createdBy: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;
  private _approvalStatus: APPROVALSTATUS;
  private _adminSharePercentage: number;
  private _details: CourseDetails | null;
  private _rating?: number;
  private _reviewCount?: number;
  private _lessons?: number;
  private _bestSeller?: boolean;

  constructor(props: CourseProps) {
    if (!props.id || props.id.trim() === "") {
      throw new Error("Course ID is required");
    }
    this._id = props.id;
    this._title = props.title;
    this._description = props.description ?? null;
    this._level = props.level;
    this._price = props.price ?? null;
    this._thumbnail = props.thumbnail ?? null;
    this._duration = props.duration ?? null;
    this._offer = props.offer ?? null;
    this._status = props.status;
    this._categoryId = props.categoryId;
    this._createdBy = props.createdBy;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
    this._deletedAt = props.deletedAt ?? null;
    this._approvalStatus = props.approvalStatus || APPROVALSTATUS.PENDING;
    this._adminSharePercentage = props.adminSharePercentage ?? 20.0;
    this._details = props.details ?? null;
    this._rating = props.rating;
    this._reviewCount = props.reviewCount;
    this._lessons = props.lessons;
    this._bestSeller = props.bestSeller;
  }

  // Getters
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

  // Business logic
  updateBasicInfo(
    props: Partial<{
      title: string;
      description: string | null;
      level: CourseLevel;
      price: Price | null;
      thumbnail: string | null;
      duration: Duration | null;
      offer: Offer | null;
      status: CourseStatus;
      categoryId: string;
      adminSharePercentage: number;
    }>
  ): void {
    if (props.title) this._title = props.title;
    if (props.description !== undefined) this._description = props.description;
    if (props.level) this._level = props.level;
    if (props.price !== undefined) this._price = props.price;
    if (props.thumbnail !== undefined) this._thumbnail = props.thumbnail;
    if (props.duration !== undefined) this._duration = props.duration;
    if (props.offer !== undefined) this._offer = props.offer;
    if (props.status) this._status = props.status;
    if (props.categoryId) this._categoryId = props.categoryId;
    if (props.adminSharePercentage !== undefined)
      this._adminSharePercentage = props.adminSharePercentage;
    this._updatedAt = new Date();
  }

  updateDetails(
    props: Partial<{
      prerequisites: string | null;
      longDescription: string | null;
      objectives: string | null;
      targetAudience: string | null;
    }>
  ): void {
    if (!this._details) {
      this._details = new CourseDetails({
        prerequisites: props.prerequisites ?? null,
        longDescription: props.longDescription ?? null,
        objectives: props.objectives ?? null,
        targetAudience: props.targetAudience ?? null,
      });
    } else {
      this._details.update(props);
    }
    this._updatedAt = new Date();
  }

  softDelete(): void {
    this._deletedAt = this._deletedAt ? null : new Date();
    this._updatedAt = new Date();
  }

  isDeleted(): boolean {
    return this._deletedAt !== null;
  }

  setApprovalStatus(status: APPROVALSTATUS): void {
    if (this._approvalStatus === status) {
      throw new Error(`Course is already ${status}`);
    }
    this._approvalStatus = status;
    this._updatedAt = new Date();
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      title: this._title,
      description: this._description,
      level: this._level,
      price:
        this._price instanceof Price ? this._price.getValue() : this._price,
      thumbnail: this._thumbnail,
      duration:
        this._duration instanceof Duration
          ? this._duration.getValue()
          : this._duration,
      offer:
        this._offer instanceof Offer ? this._offer.getValue() : this._offer,
      status: this._status,
      categoryId: this._categoryId,
      createdBy: this._createdBy,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
      deletedAt: this._deletedAt?.toISOString() ?? null,
      approvalStatus: this._approvalStatus,
      adminSharePercentage: this._adminSharePercentage,
      details: this._details?.toJSON() ?? null,
      rating: this._rating,
      reviewCount: this._reviewCount,
      lessons: this._lessons,
      bestSeller: this._bestSeller,
    };
  }

  static fromPrisma(data: {
    id: string;
    title: string;
    description: string | null;
    level: string;
    price?: { toNumber(): number } | null;
    thumbnail?: string | null;
    duration?: number | null;
    offer?: { toNumber(): number } | null;
    status: string;
    categoryId: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
    approvalStatus: string;
    adminSharePercentage: { toNumber(): number };
    details?: {
      prerequisites: string | null;
      longDescription: string | null;
      objectives: string | null;
      targetAudience: string | null;
    } | null;
    rating?: number | null;
    reviewCount?: number | null;
    lessons?: unknown[];
    bestSeller?: boolean;
  }): Course {
    return new Course({
      id: data.id,
      title: data.title,
      description: data.description,
      level: data.level as CourseLevel,
      price: data.price ? Price.create(data.price.toNumber()) : null,
      thumbnail: data.thumbnail ?? null,
      duration: data.duration ? Duration.create(data.duration) : null,
      offer: data.offer ? Offer.create(data.offer.toNumber()) : null,
      status: data.status as CourseStatus,
      categoryId: data.categoryId,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt ?? null,
      approvalStatus: data.approvalStatus as APPROVALSTATUS,
      adminSharePercentage: data.adminSharePercentage.toNumber(),
      details: data.details ? new CourseDetails(data.details) : null,
      rating: data.rating ?? undefined,
      reviewCount: data.reviewCount ?? undefined,
      lessons: data.lessons?.length,
      bestSeller: data.bestSeller ?? false,
    });
  }
}
