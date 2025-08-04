export class QuizAnswer {
  private readonly _id: string;
  private _lessonProgressId: string;
  private _quizQuestionId: string;
  private _selectedAnswer: string;
  private _isCorrect: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: {
    id: string;
    lessonProgressId: string;
    quizQuestionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.validateQuizAnswer(props);
    
    this._id = props.id;
    this._lessonProgressId = props.lessonProgressId;
    this._quizQuestionId = props.quizQuestionId;
    this._selectedAnswer = props.selectedAnswer;
    this._isCorrect = props.isCorrect;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  private validateQuizAnswer(props: any): void {
    if (!props.id) {
      throw new Error("Quiz answer ID is required");
    }

    if (!props.lessonProgressId) {
      throw new Error("Lesson progress ID is required");
    }

    if (!props.quizQuestionId) {
      throw new Error("Quiz question ID is required");
    }

    if (!props.selectedAnswer || props.selectedAnswer.trim() === "") {
      throw new Error("Selected answer is required");
    }

    if (props.selectedAnswer.length > 500) {
      throw new Error("Selected answer cannot exceed 500 characters");
    }
  }

  // Getters
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

  // Business logic methods
  markAsCorrect(): void {
    this._isCorrect = true;
    this._updatedAt = new Date();
  }

  markAsIncorrect(): void {
    this._isCorrect = false;
    this._updatedAt = new Date();
  }

  hasAnswer(): boolean {
    return this._selectedAnswer !== null && this._selectedAnswer.trim() !== "";
  }
} 