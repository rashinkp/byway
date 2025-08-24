
import { ContentStatus, ContentType } from "../enum/content.enum";
import { FileUrl } from "../value-object/file-url";

export interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  // Add other fields as per your QuizQuestion schema
}

export interface LessonContentProps {
  id: string;
  lessonId: string;
  type: ContentType;
  status: ContentStatus;
  title: string | null;
  description: string | null;
  fileUrl: FileUrl | null;
  thumbnailUrl: FileUrl | null;
  quizQuestions: QuizQuestion[] | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}



export interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface ILessonContentInput {
  id: string; // optional, since you assign new id if missing
  lessonId: string; // required
  type: ContentType; // required
  status?: ContentStatus; // optional, use enum
  title?: string | null;
  description?: string | null;
  fileUrl?: string | null;
  thumbnailUrl?: string | null;
  quizQuestions?: QuizQuestion[] | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  deletedAt?: string | Date | null;
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

  private constructor(props: LessonContentProps) {
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

  static create(input: {
    lessonId: string;
    type: ContentType;
    status?: ContentStatus;
    title?: string | null;
    description?: string | null;
    fileUrl?: string | null;
    thumbnailUrl?: string | null;
    quizQuestions?: QuizQuestion[] | null;
  }): LessonContent {
    if (!input.lessonId) {
      throw new Error("Lesson ID is required");
    }
    if (!input.type) {
      throw new Error("Content type is required");
    }

    return new LessonContent({
      id: '',
      lessonId: input.lessonId,
      type: input.type,
      status: input.status || ContentStatus.DRAFT,
      title: input.title?.trim() ?? null,
      description: input.description?.trim() ?? null,
      fileUrl: input.fileUrl ? new FileUrl(input.fileUrl) : null,
      thumbnailUrl: input.thumbnailUrl ? new FileUrl(input.thumbnailUrl) : null,
      quizQuestions: input.quizQuestions ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  }

  static update(
    existingContent: LessonContent,
    input: {
      type?: ContentType;
      status?: ContentStatus;
      title?: string | null;
      description?: string | null;
      fileUrl?: string | null;
      thumbnailUrl?: string | null;
      quizQuestions?: QuizQuestion[] | null;
    }
  ): LessonContent {
    const props: LessonContentProps = {
      ...existingContent.getProps(),
      updatedAt: new Date(),
    };

    if (input.type) {
      props.type = input.type;
    }
    if (input.status) {
      props.status = input.status;
    }
    if (input.title !== undefined) {
      props.title = input.title?.trim() ?? null;
    }
    if (input.description !== undefined) {
      props.description = input.description?.trim() ?? null;
    }
    if (input.fileUrl !== undefined) {
      props.fileUrl = input.fileUrl ? new FileUrl(input.fileUrl) : null;
    }
    if (input.thumbnailUrl !== undefined) {
      props.thumbnailUrl = input.thumbnailUrl
        ? new FileUrl(input.thumbnailUrl)
        : null;
    }
    if (input.quizQuestions !== undefined) {
      props.quizQuestions = input.quizQuestions ?? null;
    }

    return new LessonContent(props);
  }

  static fromPersistence(data: {
    id: string;
    lessonId: string;
    type: ContentType;
    status: ContentStatus;
    title: string | null;
    description: string | null;
    fileUrl: string | null;
    thumbnailUrl: string | null;
    quizQuestions: QuizQuestion[] | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }): LessonContent {
    return new LessonContent({
      id: data.id,
      lessonId: data.lessonId,
      type: data.type,
      status: data.status,
      title: data.title,
      description: data.description,
      fileUrl: data.fileUrl ? new FileUrl(data.fileUrl) : null,
      thumbnailUrl: data.thumbnailUrl ? new FileUrl(data.thumbnailUrl) : null,
      quizQuestions: data.quizQuestions ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
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

  private _getProps(): LessonContentProps {
    return {
      id: this._id,
      lessonId: this._lessonId,
      type: this._type,
      status: this._status,
      title: this._title,
      description: this._description,
      fileUrl: this._fileUrl,
      thumbnailUrl: this._thumbnailUrl,
      quizQuestions: this._quizQuestions,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
    };
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      lessonId: this._lessonId,
      type: this._type,
      status: this._status,
      title: this._title,
      description: this._description,
      fileUrl: this._fileUrl?.value ?? null,
      thumbnailUrl: this._thumbnailUrl?.value ?? null,
      quizQuestions: this._quizQuestions ?? null,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
      deletedAt: this._deletedAt?.toISOString() ?? null,
    };
  }
}
