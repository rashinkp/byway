interface QuizAnswerProps {
  id: string;
  lessonProgressId: string;
  quizQuestionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class QuizAnswer {
  private readonly _id: string;
  private readonly _lessonProgressId: string;
  private readonly _quizQuestionId: string;
  private readonly _selectedAnswer: string;
  private readonly _isCorrect: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  constructor(props: QuizAnswerProps) {
    if (!props.lessonProgressId) {
      throw new Error("Lesson progress ID is required");
    }
    if (!props.quizQuestionId) {
      throw new Error("Quiz question ID is required");
    }
    if (!props.selectedAnswer || props.selectedAnswer.trim() === "") {
      throw new Error("Selected answer is required and cannot be empty");
    }

    this._id = props.id;
    this._lessonProgressId = props.lessonProgressId;
    this._quizQuestionId = props.quizQuestionId;
    this._selectedAnswer = props.selectedAnswer.trim();
    this._isCorrect = props.isCorrect;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt ?? null;
  }

  softDelete(): void {
    if (this._deletedAt) {
      throw new Error("Quiz answer is already deleted");
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  recover(): void {
    if (!this._deletedAt) {
      throw new Error("Quiz answer is not deleted");
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

  get lessonProgressId(): string {
    return this._lessonProgressId;
  }

  get quizQuestionId(): string {
    return this._quizQuestionId;
  }

  get selectedAnswer(): string {
    return this._selectedAnswer;
  }

  get isCorrect(): boolean {
    return this._isCorrect;
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
