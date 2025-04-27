import { ContentStatus, ContentType } from "@prisma/client";

export interface ICreateLessonContentInput {
  lessonId: string;
  type: ContentType;
  status?: ContentStatus;
  data: {
    title: string;
    description?: string | null;
    fileUrl?: string;
    questions?: { question: string; options: string[]; answer: string }[];
  };
}

export interface IUpdateLessonContentInput {
  id: string;
  lessonId?: string;
  type?: ContentType;
  status?: ContentStatus;
  data?: {
    title?: string;
    description?: string | null;
    fileUrl?: string;
    questions?: { question: string; options: string[]; answer: string }[];
  };
}

export interface ILessonContent {
  id: string;
  lessonId: string;
  type: ContentType;
  status: ContentStatus;
  data: {
    title: string;
    description?: string | null;
    fileUrl?: string;
    questions?: { question: string; options: string[]; answer: string }[];
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface IContentRepository {
  createContent(input: ICreateLessonContentInput): Promise<ILessonContent>;
  getContentByLessonId(lessonId: string): Promise<ILessonContent | null>;
  updateContent(
    id: string,
    input: Partial<ICreateLessonContentInput>
  ): Promise<ILessonContent>;
  deleteContent(id: string): Promise<ILessonContent>;
}
