export interface QuizQuestionRecord {
  id: string;
  lessonContentId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  createdAt: Date;
  updatedAt: Date;
} 