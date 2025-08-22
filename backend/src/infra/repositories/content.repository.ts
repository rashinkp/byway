import { PrismaClient } from "@prisma/client";
import { ContentStatus, ContentType } from "../../domain/enum/content.enum";
import {
  LessonContent,
  QuizQuestion,
} from "../../domain/entities/content.entity";
import { ILessonContentRepository } from "../../app/repositories/content.repository";

// Type definitions for content data
interface ContentData {
  id?: string;
  lessonId: string;
  type: ContentType;
  status: ContentStatus;
  title: string;
  description: string | null;
  fileUrl: string | null;
  thumbnailUrl: string | null;
  quizQuestions?: QuizQuestionData[] | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt: string | Date | null;
}

interface QuizQuestionData {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export class LessonContentRepository implements ILessonContentRepository {
  constructor(private readonly _prisma: PrismaClient) {}

  private mapToLessonContentEntity(content: {
    id: string;
    lessonId: string;
    type: string;
    status: string;
    title: string | null;
    description: string | null;
    fileUrl: string | null;
    thumbnailUrl: string | null;
    quizQuestions?: Array<{ id: string; question: string; options: string[]; correctAnswer: string }> | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }): LessonContent {
    return LessonContent.fromPersistence({
      id: content.id,
      lessonId: content.lessonId,
      type: content.type as ContentType,
      status: content.status as ContentStatus,
      title: content.title,
      description: content.description,
      fileUrl: content.fileUrl,
      thumbnailUrl: content.thumbnailUrl,
      quizQuestions: content.quizQuestions
        ? content.quizQuestions.map((q) => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
          }))
        : null,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      deletedAt: content.deletedAt,
    });
  }

  async findById(id: string): Promise<LessonContent | null> {
    const content = await this._prisma.lessonContent.findUnique({
      where: { id, deletedAt: null }, // Only return non-soft-deleted content
      include: { quizQuestions: true },
    });

    if (!content) {
      return null;
    }

    return this.mapToLessonContentEntity(content);
  }

  async findByLessonId(lessonId: string): Promise<LessonContent | null> {
    const content = await this._prisma.lessonContent.findUnique({
      where: { lessonId },
      include: { quizQuestions: true },
    });

    if (!content) {
      return null;
    }

    return this.mapToLessonContentEntity(content);
  }

  async create(content: LessonContent): Promise<LessonContent> {
    const contentData = content.toJSON() as unknown as ContentData;

    const createdContent = await this._prisma.lessonContent.create({
      data: {
        lessonId: contentData.lessonId,
        type: contentData.type,
        status: contentData.status,
        title: contentData.title,
        description: contentData.description,
        fileUrl: contentData.fileUrl,
        thumbnailUrl: contentData.thumbnailUrl,
        quizQuestions: contentData.quizQuestions
          ? {
              create: contentData.quizQuestions.map((q: QuizQuestionData) => ({
                id: q.id || undefined,
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
              })),
            }
          : undefined,
        createdAt: new Date(contentData.createdAt),
        updatedAt: new Date(contentData.updatedAt),
        deletedAt: contentData.deletedAt
          ? new Date(contentData.deletedAt)
          : null,
      },
      include: { quizQuestions: true },
    });

    return this.mapToLessonContentEntity(createdContent);
  }

  async update(content: LessonContent): Promise<LessonContent> {
    const contentData = content.toJSON() as unknown as ContentData;

    const updatedContent = await this._prisma.lessonContent.update({
      where: { id: contentData.id },
      data: {
        type: contentData.type,
        status: contentData.status,
        title: contentData.title,
        description: contentData.description,
        fileUrl: contentData.fileUrl,
        thumbnailUrl: contentData.thumbnailUrl,
        quizQuestions: contentData.quizQuestions
          ? {
              deleteMany: {},
              create: contentData.quizQuestions.map((q: QuizQuestionData) => ({
                id: q.id || undefined,
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
              })),
            }
          : { deleteMany: {} },
        updatedAt: new Date(contentData.updatedAt),
        deletedAt: contentData.deletedAt
          ? new Date(contentData.deletedAt)
          : null,
      },
      include: { quizQuestions: true },
    });

    return this.mapToLessonContentEntity(updatedContent);
  }

  async delete(id: string): Promise<void> {
    await this._prisma.lessonContent.delete({
      where: { id },
    });
  }
}
