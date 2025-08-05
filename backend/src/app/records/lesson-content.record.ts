import { ContentType, ContentStatus } from "@prisma/client";

export interface LessonContentRecord {
  id: string;
  lessonId: string;
  type: ContentType;
  status: ContentStatus;
  title?: string | null;
  description?: string | null;
  fileUrl?: string | null;
  thumbnailUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
} 