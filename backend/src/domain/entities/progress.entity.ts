import { QuizAnswer } from "./quiz.entity";


interface LessonProgressProps {
  id: string;
  enrollmentId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: Date | null;
  score?: number;
  totalQuestions?: number;
  answers?: ReadonlyArray<QuizAnswer>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class LessonProgress {
  private readonly _id: string;
  private readonly _enrollmentId: string;
  private readonly _courseId: string;
  private readonly _lessonId: string;
  private _completed: boolean;
  private _completedAt: Date | null;
  private _score?: number;
  private _totalQuestions?: number;
  private _answers: ReadonlyArray<QuizAnswer>;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  constructor(props: LessonProgressProps) {
    if (!props.enrollmentId) {
      throw new Error("Enrollment ID is required");
    }
    if (!props.courseId) {
      throw new Error("Course ID is required");
    }
    if (!props.lessonId) {
      throw new Error("Lesson ID is required");
    }
    if (props.score && props.score < 0) {
      throw new Error("Score cannot be negative");
    }
    if (props.totalQuestions && props.totalQuestions < 0) {
      throw new Error("Total questions cannot be negative");
    }

    this._id = props.id;
    this._enrollmentId = props.enrollmentId;
    this._courseId = props.courseId;
    this._lessonId = props.lessonId;
    this._completed = props.completed;
    this._completedAt = props.completedAt ?? null;
    this._score = props.score;
    this._totalQuestions = props.totalQuestions;
    this._answers = props.answers ? [...props.answers] : [];
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt ?? null;
  }

  markAsCompleted(): void {
    if (this._deletedAt) {
      throw new Error("Cannot mark deleted lesson progress as completed");
    }
    this._completed = true;
    this._completedAt = new Date();
    this._updatedAt = new Date();
  }

  markAsIncomplete(): void {
    if (this._deletedAt) {
      throw new Error("Cannot mark deleted lesson progress as incomplete");
    }
    this._completed = false;
    this._completedAt = null;
    this._updatedAt = new Date();
  }

  updateQuizProgress(
    score: number,
    totalQuestions: number,
    answers: QuizAnswer[]
  ): void {
    if (this._deletedAt) {
      throw new Error(
        "Cannot update quiz progress for deleted lesson progress"
      );
    }
    if (score < 0) {
      throw new Error("Score cannot be negative");
    }
    if (totalQuestions < 0) {
      throw new Error("Total questions cannot be negative");
    }

    this._score = score;
    this._totalQuestions = totalQuestions;
    this._answers = [...answers];
    this._completed = score >= 0.7 * totalQuestions;
    this._completedAt = this._completed ? new Date() : null;
    this._updatedAt = new Date();
  }

  softDelete(): void {
    if (this._deletedAt) {
      throw new Error("Lesson progress is already deleted");
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  recover(): void {
    if (!this._deletedAt) {
      throw new Error("Lesson progress is not deleted");
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

  get enrollmentId(): string {
    return this._enrollmentId;
  }

  get courseId(): string {
    return this._courseId;
  }

  get lessonId(): string {
    return this._lessonId;
  }

  get completed(): boolean {
    return this._completed;
  }

  get completedAt(): Date | null {
    return this._completedAt;
  }

  get score(): number | undefined {
    return this._score;
  }

  get totalQuestions(): number | undefined {
    return this._totalQuestions;
  }

  get answers(): ReadonlyArray<QuizAnswer> {
    return this._answers;
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
