import { Rating } from "../value-object/rating";

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

  constructor(props: {
    id: string;
    courseId: string;
    userId: string;
    rating: Rating;
    title?: string | null;
    comment?: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
  }) {
    this.validateReview(props);
    
    this._id = props.id;
    this._courseId = props.courseId;
    this._userId = props.userId;
    this._rating = props.rating;
    this._title = props.title ?? null;
    this._comment = props.comment ?? null;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt ?? null;
  }

  private validateReview(props: any): void {
    if (!props.id) {
      throw new Error("Review ID is required");
    }

    if (!props.courseId) {
      throw new Error("Course ID is required");
    }

    if (!props.userId) {
      throw new Error("User ID is required");
    }

    if (!props.rating) {
      throw new Error("Rating is required");
    }

    if (props.title && props.title.length > 200) {
      throw new Error("Title cannot exceed 200 characters");
    }

    if (props.comment && props.comment.length > 1000) {
      throw new Error("Comment cannot exceed 1000 characters");
    }
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

  // Business logic methods
  update(props: {
    rating?: Rating;
    title?: string | null;
    comment?: string | null;
  }): void {
    if (props.rating !== undefined) {
      this._rating = props.rating;
    }

    if (props.title !== undefined) {
      if (props.title && props.title.length > 200) {
        throw new Error("Title cannot exceed 200 characters");
      }
      this._title = props.title;
    }

    if (props.comment !== undefined) {
      if (props.comment && props.comment.length > 1000) {
        throw new Error("Comment cannot exceed 1000 characters");
      }
      this._comment = props.comment;
    }

    this._updatedAt = new Date();
  }

  softDelete(): void {
    if (this._deletedAt) {
      throw new Error("Review is already deleted");
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  restore(): void {
    if (!this._deletedAt) {
      throw new Error("Review is not deleted");
    }
    this._deletedAt = null;
    this._updatedAt = new Date();
  }

  isDeleted(): boolean {
    return this._deletedAt !== null;
  }

  isActive(): boolean {
    return !this.isDeleted();
  }

  hasTitle(): boolean {
    return this._title !== null && this._title.trim() !== "";
  }

  hasComment(): boolean {
    return this._comment !== null && this._comment.trim() !== "";
  }
} 