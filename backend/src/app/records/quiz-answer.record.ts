export interface QuizAnswerRecord {
  id: string;
  quizQuestionId: string;
  userId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  createdAt: Date;
  updatedAt: Date;
} 