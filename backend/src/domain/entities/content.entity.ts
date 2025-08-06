import { ContentStatus, ContentType } from "../enum/content.enum";
import { LessonContentProps, QuizQuestion } from "../interfaces/content";
import { FileUrl } from "../value-object/file-url";

export class LessonContent {
  private readonly _id: string;
  private _lessonId: string;
  private _type: ContentType;
  private _status: ContentStatus;
  private _title: string | null;
  private _description: string | null;
  private _fileUrl: FileUrl | null;
  private _thumbnailUrl: FileUrl | null;
  private _quizQuestions: QuizQuestion[] | null;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  constructor(props: LessonContentProps) {
    if (!props.lessonId) {
      throw new Error("Lesson ID is required");
    }
    if (!props.type) {
      throw new Error("Content type is required");
    }

    this._id = props.id;
    this._lessonId = props.lessonId;
    this._type = props.type;
    this._status = props.status;
    this._title = props.title?.trim() ?? null;
    this._description = props.description?.trim() ?? null;
    this._fileUrl = props.fileUrl ?? null;
    this._thumbnailUrl = props.thumbnailUrl ?? null;
    this._quizQuestions = props.quizQuestions ?? null;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt ?? null;
  }

  softDelete(): void {
    if (this._deletedAt) {
      throw new Error("Content is already deleted");
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  isActive(): boolean {
    return !this._deletedAt;
  }

  get id(): string {
    return this._id;
  }

  get lessonId(): string {
    return this._lessonId;
  }

  get type(): ContentType {
    return this._type;
  }

  get status(): ContentStatus {
    return this._status;
  }

  get title(): string | null {
    return this._title;
  }

  get description(): string | null {
    return this._description;
  }

  get fileUrl(): string | null {
    return this._fileUrl?.value ?? null;
  }

  get thumbnailUrl(): string | null {
    return this._thumbnailUrl?.value ?? null;
  }

  get quizQuestions(): QuizQuestion[] | null {
    return this._quizQuestions;
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
