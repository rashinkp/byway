import { z } from "zod";

export const UpdateProgressSchema = z.object({
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  lessonId: z.string().uuid(),
  completed: z.boolean().optional(),
});

export const GetProgressSchema = z.object({
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
});

export type UpdateProgressDto = z.infer<typeof UpdateProgressSchema>;
export type GetProgressDto = z.infer<typeof GetProgressSchema>;

export interface ILessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: Date;
}

export interface IProgressOutputDTO {
  userId: string;
  courseId: string;
  lastLessonId?: string;
  completedAt?: Date;
  enrolledAt: Date;
  accessStatus: 'ACTIVE' | 'BLOCKED' | 'EXPIRED';
  completedLessons: number;
  totalLessons: number;
  lessonProgress: ILessonProgress[];
} 