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

  update(props: Partial<{
    prerequisites: string | null;
    longDescription: string | null;
    objectives: string | null;
    targetAudience: string | null;
  }>): void {
    if (props.prerequisites !== undefined) this._prerequisites = props.prerequisites;
    if (props.longDescription !== undefined) this._longDescription = props.longDescription;
    if (props.objectives !== undefined) this._objectives = props.objectives;
    if (props.targetAudience !== undefined) this._targetAudience = props.targetAudience;
  }
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

  constructor(props: {
    id: string;
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
  }) {
    this.validateCourse(props);
    
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
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
    this._deletedAt = props.deletedAt ?? null;
    this._approvalStatus = props.approvalStatus ?? APPROVALSTATUS.PENDING;
    this._adminSharePercentage = props.adminSharePercentage ?? 0;
    this._details = props.details ?? null;
    this._rating = props.rating;
    this._reviewCount = props.reviewCount;
    this._lessons = props.lessons;
    this._bestSeller = props.bestSeller;
  }

  private validateCourse(props: any): void {
    if (!props.title || props.title.trim() === "") {
      throw new Error("Course title is required");
    }

    if (!props.categoryId) {
      throw new Error("Category ID is required");
    }

    if (!props.createdBy) {
      throw new Error("Creator ID is required");
    }

    if (props.adminSharePercentage !== undefined && (props.adminSharePercentage < 0 || props.adminSharePercentage > 100)) {
      throw new Error("Admin share percentage must be between 0 and 100");
    }
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

  // Business logic methods
  updateBasicInfo(props: Partial<{
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
  }>): void {
    if (props.title && props.title.trim() !== "") {
      this._title = props.title;
    }
    if (props.description !== undefined) this._description = props.description;
    if (props.level !== undefined) this._level = props.level;
    if (props.price !== undefined) this._price = props.price;
    if (props.thumbnail !== undefined) this._thumbnail = props.thumbnail;
    if (props.duration !== undefined) this._duration = props.duration;
    if (props.offer !== undefined) this._offer = props.offer;
    if (props.status !== undefined) this._status = props.status;
    if (props.categoryId) this._categoryId = props.categoryId;
    if (props.adminSharePercentage !== undefined) {
      if (props.adminSharePercentage < 0 || props.adminSharePercentage > 100) {
        throw new Error("Admin share percentage must be between 0 and 100");
      }
      this._adminSharePercentage = props.adminSharePercentage;
    }
    
    this._updatedAt = new Date();
  }

  updateDetails(props: Partial<{
    prerequisites: string | null;
    longDescription: string | null;
    objectives: string | null;
    targetAudience: string | null;
  }>): void {
    if (!this._details) {
      this._details = new CourseDetails({});
    }
    
    this._details.update(props);
    this._updatedAt = new Date();
  }

  softDelete(): void {
    if (this._deletedAt) {
      throw new Error("Course is already deleted");
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  isDeleted(): boolean {
    return this._deletedAt !== null;
  }

  setApprovalStatus(status: APPROVALSTATUS): void {
    if (this._approvalStatus === status) {
      throw new Error(`Course is already ${status.toLowerCase()}`);
    }
    this._approvalStatus = status;
    this._updatedAt = new Date();
  }

  updateRating(rating: number, reviewCount: number): void {
    if (rating < 0 || rating > 5) {
      throw new Error("Rating must be between 0 and 5");
    }
    if (reviewCount < 0) {
      throw new Error("Review count cannot be negative");
    }
    
    this._rating = rating;
    this._reviewCount = reviewCount;
    this._updatedAt = new Date();
  }

  updateLessonCount(count: number): void {
    if (count < 0) {
      throw new Error("Lesson count cannot be negative");
    }
    this._lessons = count;
    this._updatedAt = new Date();
  }

  setBestSeller(isBestSeller: boolean): void {
    this._bestSeller = isBestSeller;
    this._updatedAt = new Date();
  }

  isPublished(): boolean {
    return this._status === CourseStatus.PUBLISHED && 
           this._approvalStatus === APPROVALSTATUS.APPROVED && 
           !this.isDeleted();
  }

  canBeEnrolled(): boolean {
    return this.isPublished();
  }

  getFinalPrice(): number {
    if (!this._price) return 0;
    
    const basePrice = this._price.value;
    if (this._offer) {
      return basePrice - (basePrice * this._offer.value / 100);
    }
    return basePrice;
  }

  isFree(): boolean {
    return this.getFinalPrice() === 0;
  }
}
