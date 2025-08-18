import { Rating } from "../value-object/rating";

export interface CourseReviewProps {
  id?: string;
  courseId: string;
  userId: string;
  rating: Rating;
  title?: string | null;
  comment?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class CourseReview {
  private readonly _id: string;
  private _courseId: string;
  private _userId: string;
  private _rating: Rating;
  private _title: string | null;
  private _comment: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  constructor(props: CourseReviewProps) {
    this._id = props.id || '';
    this._courseId = props.courseId;
    this._userId = props.userId;
    this._rating = props.rating;
    this._title = props.title ?? null;
    this._comment = props.comment ?? null;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
    this._deletedAt = props.deletedAt ?? null;
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get courseId(): string {
    return this._courseId;
  }

  get userId(): string {
    return this._userId;
  }

  get rating(): Rating {
    return this._rating;
  }

  get title(): string | null {
    return this._title;
  }

  get comment(): string | null {
    return this._comment;
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

  // Business methods
  updateReview(props: Partial<{
    rating: Rating;
    title: string | null;
    comment: string | null;
  }>): void {
    if (props.rating !== undefined) {
      this._rating = props.rating;
    }
    if (props.title !== undefined) {
      this._title = props.title;
    }
    if (props.comment !== undefined) {
      this._comment = props.comment;
    }
    this._updatedAt = new Date();
  }

  softDelete(): void {
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  restore(): void {
    this._deletedAt = null;
    this._updatedAt = new Date();
  }

  isDeleted(): boolean {
    return this._deletedAt !== null;
  }

  // Validation methods
  canBeUpdatedBy(userId: string): boolean {
    return this._userId === userId && !this.isDeleted();
  }

  canBeDeletedBy(userId: string): boolean {
    return this._userId === userId && !this.isDeleted();
  }

  // Serialization
  toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      courseId: this._courseId,
      userId: this._userId,
      rating: this._rating.value,
      title: this._title,
      comment: this._comment,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
    };
  }

  // Factory method for creating from persisted data
  static fromPersistence(data: { 
    id: string; 
    courseId: string; 
    userId: string; 
    rating: number; 
    title: string | null; 
    comment: string | null; 
    createdAt: Date; 
    updatedAt: Date; 
    deletedAt: Date | null; 
  }): CourseReview {
    return new CourseReview({
      id: data.id,
      courseId: data.courseId,
      userId: data.userId,
      rating: new Rating(data.rating),
      title: data.title,
      comment: data.comment,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }
} 