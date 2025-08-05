export interface QuizAnswerRecord {
  id: string;
  lessonProgressId: string;
  quizQuestionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  createdAt: Date;
  updatedAt: Date;
} 