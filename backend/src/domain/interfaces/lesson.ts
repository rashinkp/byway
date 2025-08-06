import { LessonContent } from "../entities/content.entity";
import { LessonStatus } from "../enum/lesson.enum";
import { LessonOrder } from "../value-object/lesson-order";

// Interface for Lesson properties
export interface LessonProps {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  order: LessonOrder;
  status: LessonStatus;
  content?: LessonContent | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
