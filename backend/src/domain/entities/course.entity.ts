import { v4 as uuidv4 } from "uuid";
import { CourseLevel } from "../enum/course-level.enum";
import { Price } from "../value-object/price";
import { Duration } from "../value-object/duration";
import { Offer } from "../value-object/offer";
import { CourseStatus } from "../enum/course-status.enum";
import { APPROVALSTATUS } from "../enum/approval-status.enum";

export interface CourseDetails {
  prerequisites?: string | null;
  longDescription?: string | null;
  objectives?: string | null;
  targetAudience?: string | null;
}

export interface CourseProps {
  id?: string;
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
  private _details: CourseDetails | null;
  private _rating?: number;
  private _reviewCount?: number;
  private _lessons?: number;
  private _bestSeller?: boolean;

  constructor(props: CourseProps) {
    this._id = props.id || uuidv4();
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
  update(props: Partial<CourseProps>): void {
    if (props.title) this._title = props.title;
    if (props.description !== undefined)
      this._description = props.description ?? null;
    if (props.level) this._level = props.level;
    if (props.price !== undefined) this._price = props.price ?? null;
    if (props.thumbnail !== undefined)
      this._thumbnail = props.thumbnail ?? null;
    if (props.duration !== undefined) this._duration = props.duration ?? null;
    if (props.offer !== undefined) this._offer = props.offer ?? null;
    if (props.status) this._status = props.status;
    if (props.categoryId) this._categoryId = props.categoryId;
    if (props.details !== undefined) this._details = props.details ?? null;
    this._updatedAt = new Date();
  }

  softDelete(): void {
    this._deletedAt = this._deletedAt ? null : new Date();
    this._updatedAt = new Date();
  }

  setApprovalStatus(status: APPROVALSTATUS): void {
    if (this._approvalStatus === status) {
      throw new Error(`Course is already ${status}`);
    }
    this._approvalStatus = status;
    this._updatedAt = new Date();
  }

  toJSON(): any {
    return {
      id: this._id,
      title: this._title,
      description: this._description,
      level: this._level,
      price: this._price?.getValue() ?? null,
      thumbnail: this._thumbnail,
      duration: this._duration?.getValue() ?? null,
      offer: this._offer?.getValue() ?? null,
      status: this._status,
      categoryId: this._categoryId,
      createdBy: this._createdBy,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
      deletedAt: this._deletedAt?.toISOString() ?? null,
      approvalStatus: this._approvalStatus,
      details: this._details,
      rating: this._rating,
      reviewCount: this._reviewCount,
      lessons: this._lessons,
      bestSeller: this._bestSeller,
    };
  }

  static fromPrisma(data: any): Course {
    return new Course({
      id: data.id,
      title: data.title,
      description: data.description,
      level: data.level,
      price: data.price ? Price.create(data.price.toNumber()) : null,
      thumbnail: data.thumbnail,
      duration: data.duration ? Duration.create(data.duration) : null,
      offer: data.offer ? Offer.create(data.offer.toNumber()) : null,
      status: data.status,
      categoryId: data.categoryId,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
      approvalStatus: data.approvalStatus,
      details: data.details,
    });
  }
}
