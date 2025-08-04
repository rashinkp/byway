import { ContentStatus, ContentType } from "../enum/content.enum";
import { FileUrl } from "../value-object/file-url";

export interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

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

  constructor(props: {
    id: string;
    lessonId: string;
    type: ContentType;
    status: ContentStatus;
    title?: string | null;
    description?: string | null;
    fileUrl?: FileUrl | null;
    thumbnailUrl?: FileUrl | null;
    quizQuestions?: QuizQuestion[] | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
  }) {
    this.validateContent(props);
    
    this._id = props.id;
    this._lessonId = props.lessonId;
    this._type = props.type;
    this._status = props.status;
    this._title = props.title ?? null;
    this._description = props.description ?? null;
    this._fileUrl = props.fileUrl ?? null;
    this._thumbnailUrl = props.thumbnailUrl ?? null;
    this._quizQuestions = props.quizQuestions ?? null;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt ?? null;
  }

  private validateContent(props: any): void {
    if (!props.id) {
      throw new Error("Content ID is required");
    }

    if (!props.lessonId) {
      throw new Error("Lesson ID is required");
    }

    if (!props.type) {
      throw new Error("Content type is required");
    }

    if (!props.status) {
      throw new Error("Content status is required");
    }

    if (props.title && props.title.length > 200) {
      throw new Error("Title cannot exceed 200 characters");
    }

    if (props.description && props.description.length > 1000) {
      throw new Error("Description cannot exceed 1000 characters");
    }
  }

  // Getters
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

  // Business logic methods
  update(props: {
    type?: ContentType;
    status?: ContentStatus;
    title?: string | null;
    description?: string | null;
    fileUrl?: FileUrl | null;
    thumbnailUrl?: FileUrl | null;
    quizQuestions?: QuizQuestion[] | null;
  }): void {
    if (props.type !== undefined) {
      this._type = props.type;
    }

    if (props.status !== undefined) {
      this._status = props.status;
    }

    if (props.title !== undefined) {
      if (props.title && props.title.length > 200) {
        throw new Error("Title cannot exceed 200 characters");
      }
      this._title = props.title;
    }

    if (props.description !== undefined) {
      if (props.description && props.description.length > 1000) {
        throw new Error("Description cannot exceed 1000 characters");
      }
      this._description = props.description;
    }

    if (props.fileUrl !== undefined) {
      this._fileUrl = props.fileUrl;
    }

    if (props.thumbnailUrl !== undefined) {
      this._thumbnailUrl = props.thumbnailUrl;
    }

    if (props.quizQuestions !== undefined) {
      this._quizQuestions = props.quizQuestions;
    }

    this._updatedAt = new Date();
  }

  softDelete(): void {
    if (this._deletedAt) {
      throw new Error("Content is already deleted");
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  restore(): void {
    if (!this._deletedAt) {
      throw new Error("Content is not deleted");
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
    return this._status === ContentStatus.PUBLISHED && !this.isDeleted();
  }

  hasFile(): boolean {
    return this._fileUrl !== null;
  }

  hasThumbnail(): boolean {
    return this._thumbnailUrl !== null;
  }

  hasQuiz(): boolean {
    return this._quizQuestions !== null && this._quizQuestions.length > 0;
  }
}
