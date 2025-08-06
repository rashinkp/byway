import { LessonOrder } from "../value-object/lesson-order";
import { LessonStatus } from "../enum/lesson.enum";
import { LessonContent } from "./content.entity";
import { LessonProps } from "../interfaces/lesson";


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

  constructor(props: LessonProps) {
    if (!props.courseId) {
      throw new Error("Course ID is required");
    }
    if (!props.title || props.title.trim() === "") {
      throw new Error("Lesson title cannot be empty");
    }

    this._id = props.id;
    this._courseId = props.courseId;
    this._title = props.title.trim();
    this._description = props.description?.trim() ?? null;
    this._order = props.order;
    this._status = props.status;
    this._content = props.content ?? null;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt ?? null;
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

  isActive(): boolean {
    return !this._deletedAt;
  }

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
}
