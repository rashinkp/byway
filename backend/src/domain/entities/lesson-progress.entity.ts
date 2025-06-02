import { v4 as uuidv4 } from "uuid";

export interface LessonProgressProps {
  id: string;
  enrollmentId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class LessonProgress {
  private readonly _id: string;
  private _enrollmentId: string;
  private _courseId: string;
  private _lessonId: string;
  private _completed: boolean;
  private _completedAt: Date | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: LessonProgressProps) {
    this._id = props.id;
    this._enrollmentId = props.enrollmentId;
    this._courseId = props.courseId;
    this._lessonId = props.lessonId;
    this._completed = props.completed;
    this._completedAt = props.completedAt ?? null;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    enrollmentId: string;
    courseId: string;
    lessonId: string;
    completed?: boolean;
  }): LessonProgress {
    return new LessonProgress({
      id: uuidv4(),
      enrollmentId: props.enrollmentId,
      courseId: props.courseId,
      lessonId: props.lessonId,
      completed: props.completed ?? false,
      completedAt: props.completed ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(data: {
    id: string;
    enrollmentId: string;
    courseId: string;
    lessonId: string;
    completed: boolean;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): LessonProgress {
    return new LessonProgress({
      id: data.id,
      enrollmentId: data.enrollmentId,
      courseId: data.courseId,
      lessonId: data.lessonId,
      completed: data.completed,
      completedAt: data.completedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
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

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  markAsCompleted(): void {
    this._completed = true;
    this._completedAt = new Date();
    this._updatedAt = new Date();
  }

  markAsIncomplete(): void {
    this._completed = false;
    this._completedAt = null;
    this._updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this._id,
      enrollmentId: this._enrollmentId,
      courseId: this._courseId,
      lessonId: this._lessonId,
      completed: this._completed,
      completedAt: this._completedAt,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
} 