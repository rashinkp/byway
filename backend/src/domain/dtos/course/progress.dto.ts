import { z } from "zod";

export const UpdateProgressSchema = z.object({
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  progress: z.number().min(0).max(100),
  lastLessonId: z.string().uuid().optional(),
});

export const GetProgressSchema = z.object({
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
});

export type UpdateProgressDto = z.infer<typeof UpdateProgressSchema>;
export type GetProgressDto = z.infer<typeof GetProgressSchema>;

export interface IProgressOutputDTO {
  userId: string;
  courseId: string;
  progress: number;
  lastLessonId?: string;
  completedAt?: string;
  accessStatus: 'ACTIVE' | 'BLOCKED' | 'EXPIRED';
} 