import { QuizAnswer } from "./quiz-answer.entity";

export class LessonProgress {
  private readonly _id: string;
  private _enrollmentId: string;
  private _courseId: string;
  private _lessonId: string;
  private _completed: boolean;
  private _completedAt: Date | null;
  private _score?: number;
  private _totalQuestions?: number;
  private _answers?: QuizAnswer[];
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: {
    id: string;
    enrollmentId: string;
    courseId: string;
    lessonId: string;
    completed: boolean;
    completedAt?: Date | null;
    score?: number;
    totalQuestions?: number;
    answers?: QuizAnswer[];
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.validateLessonProgress(props);
    
    this._id = props.id;
    this._enrollmentId = props.enrollmentId;
    this._courseId = props.courseId;
    this._lessonId = props.lessonId;
    this._completed = props.completed;
    this._completedAt = props.completedAt ?? null;
    this._score = props.score;
    this._totalQuestions = props.totalQuestions;
    this._answers = props.answers;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  private validateLessonProgress(props: any): void {
    if (!props.id) {
      throw new Error("Lesson progress ID is required");
    }

    if (!props.enrollmentId) {
      throw new Error("Enrollment ID is required");
    }

    if (!props.courseId) {
      throw new Error("Course ID is required");
    }

    if (!props.lessonId) {
      throw new Error("Lesson ID is required");
    }

    if (props.score !== undefined && (props.score < 0 || props.score > 100)) {
      throw new Error("Score must be between 0 and 100");
    }

    if (props.totalQuestions !== undefined && props.totalQuestions < 0) {
      throw new Error("Total questions cannot be negative");
    }

    if (props.completedAt && !props.completed) {
      throw new Error("Cannot have completion date when not completed");
    }
  }

  // Getters
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

  get answers(): QuizAnswer[] | undefined {
    return this._answers;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business logic methods
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

  updateQuizProgress(score: number, totalQuestions: number, answers: QuizAnswer[]): void {
    if (score < 0 || score > 100) {
      throw new Error("Score must be between 0 and 100");
    }

    if (totalQuestions < 0) {
      throw new Error("Total questions cannot be negative");
    }

    this._score = score;
    this._totalQuestions = totalQuestions;
    this._answers = answers;
    this._completed = score >= 70; // Consider quiz completed if score is 70% or higher
    this._completedAt = this._completed ? new Date() : null;
    this._updatedAt = new Date();
  }

  updateScore(score: number): void {
    if (score < 0 || score > 100) {
      throw new Error("Score must be between 0 and 100");
    }
    
    this._score = score;
    this._updatedAt = new Date();
  }

  updateTotalQuestions(totalQuestions: number): void {
    if (totalQuestions < 0) {
      throw new Error("Total questions cannot be negative");
    }
    
    this._totalQuestions = totalQuestions;
    this._updatedAt = new Date();
  }

  hasQuizScore(): boolean {
    return this._score !== undefined;
  }

  getQuizPercentage(): number | undefined {
    if (this._score === undefined || this._totalQuestions === undefined) {
      return undefined;
    }
    return (this._score / this._totalQuestions) * 100;
  }

  isQuizPassed(): boolean {
    return this._score !== undefined && this._score >= 70;
  }
} 