import { QuizAnswer } from "./quiz-answer.entity";

export interface ILessonProgressProps {
  id?: string;
  enrollmentId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: Date | null;
  score?: number;
  totalQuestions?: number;
  answers?: QuizAnswer[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class LessonProgress {
  private readonly props: ILessonProgressProps;

  private constructor(props: ILessonProgressProps) {
    this.props = props;
  }

  public static create(props: ILessonProgressProps): LessonProgress {
    return new LessonProgress({
      ...props,
      completed: props.completed ?? false,
      completedAt: props.completedAt ?? null,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  public static fromPersistence(data: ILessonProgressProps): LessonProgress {
    return new LessonProgress({
      ...data,
      completedAt: data.completedAt ? new Date(data.completedAt) : null,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    });
  }

  public markAsCompleted(): void {
    this.props.completed = true;
    this.props.completedAt = new Date();
    this.props.updatedAt = new Date();
  }

  public markAsIncomplete(): void {
    this.props.completed = false;
    this.props.completedAt = null;
    this.props.updatedAt = new Date();
  }

  public updateQuizProgress(score: number, totalQuestions: number, answers: QuizAnswer[]): void {
    this.props.score = score;
    this.props.totalQuestions = totalQuestions;
    this.props.answers = answers;
    this.props.completed = score >= 70; // Consider quiz completed if score is 70% or higher
    this.props.completedAt = this.props.completed ? new Date() : null;
    this.props.updatedAt = new Date();
  }

  public get id(): string | undefined {
    return this.props.id;
  }

  public get enrollmentId(): string {
    return this.props.enrollmentId;
  }

  public get courseId(): string {
    return this.props.courseId;
  }

  public get lessonId(): string {
    return this.props.lessonId;
  }

  public get completed(): boolean {
    return this.props.completed;
  }

  public get completedAt(): Date | null {
    return this.props.completedAt ?? null;
  }

  public get score(): number | undefined {
    return this.props.score;
  }

  public get totalQuestions(): number | undefined {
    return this.props.totalQuestions;
  }

  public get answers(): QuizAnswer[] | undefined {
    return this.props.answers;
  }

  public get createdAt(): Date {
    return this.props.createdAt!;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  public updateScore(score: number): void {
    this.props.score = score;
  }

  public updateTotalQuestions(totalQuestions: number): void {
    this.props.totalQuestions = totalQuestions;
  }

  public toJSON(): ILessonProgressProps {
    return {
      ...this.props,
      completedAt: this.props.completedAt,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
} 