import { LessonOrder } from "../value-object/lesson-order";
import { LessonStatus } from "../enum/lesson.enum";
import { LessonContent } from "./lesson-content.entity";

export class Lesson {
  private readonly _id: string;
  private _courseId: string;
  private _title: string;
  private _description: string | null;
  private _order: LessonOrder;
  private _status: LessonStatus;
  private _content: LessonContent | null;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  constructor(props: {
    id: string;
    courseId: string;
    title: string;
    description?: string | null;
    order: LessonOrder;
    status: LessonStatus;
    content?: LessonContent | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
  }) {
    this.validateLesson(props);
    
    this._id = props.id;
    this._courseId = props.courseId;
    this._title = props.title;
    this._description = props.description ?? null;
    this._order = props.order;
    this._status = props.status;
    this._content = props.content ?? null;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt ?? null;
  }

  private validateLesson(props: any): void {
    if (!props.id) {
      throw new Error("Lesson ID is required");
    }

    if (!props.courseId) {
      throw new Error("Course ID is required");
    }

    if (!props.title || props.title.trim() === "") {
      throw new Error("Lesson title cannot be empty");
    }

    if (!props.order) {
      throw new Error("Lesson order is required");
    }

    if (!props.status) {
      throw new Error("Lesson status is required");
    }
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get courseId(): string {
    return this._courseId;
  }

  get title(): string {
    return this._title;
  }

  get description(): string | null {
    return this._description;
  }

  get order(): number {
    return this._order.value;
  }

  get status(): LessonStatus {
    return this._status;
  }

  get content(): LessonContent | null {
    return this._content;
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
    title?: string;
    description?: string | null;
    order?: number;
    status?: LessonStatus;
  }): void {
    if (props.title && props.title.trim() !== "") {
      this._title = props.title.trim();
    }

    if (props.description !== undefined) {
      this._description = props.description?.trim() ?? null;
    }

    if (props.order !== undefined) {
      this._order = new LessonOrder(props.order);
    }

    if (props.status !== undefined) {
      this._status = props.status;
    }

    this._updatedAt = new Date();
  }

  setContent(content: LessonContent): void {
    this._content = content;
    this._updatedAt = new Date();
  }

  removeContent(): void {
    this._content = null;
    this._updatedAt = new Date();
  }

  softDelete(): void {
    if (this._deletedAt) {
      throw new Error("Lesson is already deleted");
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  recover(): void {
    if (!this._deletedAt) {
      throw new Error("Lesson is not deleted");
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

  isPublished(): boolean {
    return this._status === LessonStatus.PUBLISHED && !this.isDeleted();
  }

  hasContent(): boolean {
    return this._content !== null;
  }

  canBeAccessed(): boolean {
    return this.isPublished() && this.hasContent();
  }
}
