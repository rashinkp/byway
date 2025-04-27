import { PrismaClient } from "@prisma/client";
import {
  IContentRepository,
  ILessonContent,
  ICreateLessonContentInput,
} from "./content.types";

export class ContentRepository implements IContentRepository {
  constructor(private prisma: PrismaClient) {}

  async createContent(
    input: ICreateLessonContentInput
  ): Promise<ILessonContent> {
    const content = await this.prisma.lessonContent.create({
      data: {
        lessonId: input.lessonId,
        type: input.type,
        status: input.status || "PUBLISHED",
        data: input.data,
      },
    });
    return {
      id: content.id,
      lessonId: content.lessonId,
      type: content.type,
      status: content.status,
      data: content.data as any,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      deletedAt: content.deletedAt || undefined,
    };
  }

  async getContentByLessonId(lessonId: string): Promise<ILessonContent | null> {
    const content = await this.prisma.lessonContent.findUnique({
      where: { lessonId },
    });
    if (!content) return null;
    return {
      id: content.id,
      lessonId: content.lessonId,
      type: content.type,
      status: content.status,
      data: content.data as any,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      deletedAt: content.deletedAt || undefined,
    };
  }

  async updateContent(
    id: string,
    input: Partial<ICreateLessonContentInput>
  ): Promise<ILessonContent> {
    const content = await this.prisma.lessonContent.update({
      where: { id },
      data: {
        lessonId: input.lessonId,
        type: input.type,
        status: input.status,
        data: input.data,
        updatedAt: new Date(),
      },
    });
    return {
      id: content.id,
      lessonId: content.lessonId,
      type: content.type,
      status: content.status,
      data: content.data as any,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      deletedAt: content.deletedAt || undefined,
    };
  }

  async deleteContent(id: string): Promise<ILessonContent> {
    const content = await this.prisma.lessonContent.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return {
      id: content.id,
      lessonId: content.lessonId,
      type: content.type,
      status: content.status,
      data: content.data as any,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      deletedAt: content.deletedAt || undefined,
    };
  }
}
