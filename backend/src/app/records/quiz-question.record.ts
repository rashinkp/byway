export interface QuizQuestionRecord {
  id: string;
  lessonContentId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  createdAt: Date;
  updatedAt: Date;
} 