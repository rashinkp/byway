import { PrismaClient } from "@prisma/client";
import { ContentStatus, ContentType } from "../../domain/enum/content.enum";
import {
  LessonContent,
} from "../../domain/entities/content.entity";
import { ILessonContentRepository } from "../../app/repositories/content.repository";
import { GenericRepository } from "./base/generic.repository";

export interface ContentData {
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

export interface QuizQuestionData {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export class LessonContentRepository extends GenericRepository<LessonContent> implements ILessonContentRepository {
  constructor(private readonly _prisma: PrismaClient) {
    super(_prisma, 'lessonContent');
  }

  protected getPrismaModel() {
    return this._prisma.lessonContent;
  }

  protected mapToEntity(content: any): LessonContent {
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
        ? content.quizQuestions.map((q: any) => ({
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

  protected mapToPrismaData(entity: any): any {
    if (entity instanceof LessonContent) {
      const contentData = entity.toJSON() as unknown as ContentData;
      return {
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
      };
    }
    return entity;
  }

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
    return this.findByIdGeneric(id);
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
    return this.createGeneric(content);
  }

  async createContent(content: LessonContent): Promise<LessonContent> {
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

  async update(id: string, content: LessonContent): Promise<LessonContent> {
    return this.updateGeneric(id, content);
  }

  async updateContent(content: LessonContent): Promise<LessonContent> {
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
    return this.deleteGeneric(id);
  }

  // Additional generic methods
  async find(filter?: any): Promise<LessonContent[]> {
    return this.findGeneric(filter);
  }

  async softDelete(id: string): Promise<LessonContent> {
    const deleted = await this._prisma.lessonContent.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
      include: { quizQuestions: true },
    });
    return this.mapToEntity(deleted);
  }

  async count(filter?: any): Promise<number> {
    return this.countGeneric(filter);
  }
}
