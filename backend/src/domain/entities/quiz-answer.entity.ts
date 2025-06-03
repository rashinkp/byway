export interface IQuizAnswerProps {
  id?: string;
  lessonProgressId: string;
  quizQuestionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class QuizAnswer {
  private readonly props: IQuizAnswerProps;

  private constructor(props: IQuizAnswerProps) {
    this.props = props;
  }

  public static create(props: Omit<IQuizAnswerProps, 'id' | 'createdAt' | 'updatedAt'>): QuizAnswer {
    return new QuizAnswer({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static fromPersistence(data: IQuizAnswerProps): QuizAnswer {
    return new QuizAnswer({
      ...data,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    });
  }

  public get id(): string | undefined {
    return this.props.id;
  }

  public get lessonProgressId(): string {
    return this.props.lessonProgressId;
  }

  public get quizQuestionId(): string {
    return this.props.quizQuestionId;
  }

  public get selectedAnswer(): string {
    return this.props.selectedAnswer;
  }

  public get isCorrect(): boolean {
    return this.props.isCorrect;
  }

  public get createdAt(): Date {
    return this.props.createdAt!;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  public toJSON(): IQuizAnswerProps {
    return {
      ...this.props,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
} 