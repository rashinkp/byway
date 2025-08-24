import {
  PrismaClient,
  Lesson as PrismaLesson,
  LessonContent as PrismaLessonContent,
} from "@prisma/client";
import {
  ILessonListOutputDTO,
  IGetAllLessonsInputDTO,
  IGetPublicLessonsInputDTO,
  IPublicLessonListOutputDTO,
  ILessonOutputDTO,
} from "../../app/dtos/lesson.dto";
import { LessonStatus } from "../../domain/enum/lesson.enum";
import { ContentStatus, ContentType } from "../../domain/enum/content.enum";
import { ILessonRepository } from "../../app/repositories/lesson.repository";
import { Lesson } from "../../domain/entities/lesson.entity";
import {
  LessonContent,
} from "../../domain/entities/content.entity";

// Type definitions for lesson data
interface LessonData {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  order: number;
  status: LessonStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt: string | Date | null;
  content?: ContentData | null;
}

interface ContentData {
  id?: string;
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

export class LessonRepository implements ILessonRepository {
  constructor(private readonly _prisma: PrismaClient) {}

  async getAllLessons(
    params: IGetAllLessonsInputDTO
  ): Promise<ILessonListOutputDTO> {
    const {
      courseId,
      page = 1,
      limit = 10,
      sortBy = "order",
      sortOrder = "asc",
      search,
      filterBy = "ALL",
      includeDeleted = false,
    } = params;

    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {
      courseId,
      ...(includeDeleted ? {} : { deletedAt: null }),
      ...(filterBy !== "ALL" && filterBy !== "INACTIVE"
        ? { status: filterBy }
        : filterBy === "INACTIVE"
        ? { deletedAt: { not: null } }
        : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [lessons, total] = await Promise.all([
      this._prisma.lesson.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: { content: { include: { quizQuestions: true } } },
      }),
      this._prisma.lesson.count({ where }),
    ]);

    return {
      lessons: lessons.map(this.mapToLessonOutputDTO),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPublicLessons(
    params: IGetPublicLessonsInputDTO
  ): Promise<IPublicLessonListOutputDTO> {
    const {
      courseId,
      page = 1,
      limit = 10,
      sortBy = "order",
      sortOrder = "asc",
      search,
    } = params;

    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {
      courseId,
      status: LessonStatus.PUBLISHED,
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [lessons, total] = await Promise.all([
      this._prisma.lesson.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          title: true,
          description: true,
          order: true,
        },
      }),
      this._prisma.lesson.count({ where }),
    ]);

    return {
      lessons: lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        order: lesson.order,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Lesson | null> {
    const lesson = await this._prisma.lesson.findUnique({
      where: { id },
      include: { content: { include: { quizQuestions: true } } },
    });

    if (!lesson) {
      return null;
    }

    return this._mapToLessonEntity(lesson);
  }

  async create(lesson: Lesson): Promise<Lesson> {
    const lessonData = lesson.toJSON() as unknown as LessonData;
    const contentData = lessonData.content;

    const createdLesson = await this._prisma.lesson.create({
      data: {
        course: { connect: { id: lessonData.courseId } },
        title: lessonData.title,
        description: lessonData.description,
        order: lessonData.order,
        status: lessonData.status,
        createdAt: new Date(lessonData.createdAt),
        updatedAt: new Date(lessonData.updatedAt),
        deletedAt: lessonData.deletedAt ? new Date(lessonData.deletedAt) : null,
        content: contentData
          ? {
              create: {
                id: contentData.id || undefined,
                type: contentData.type,
                status: contentData.status,
                title: contentData.title,
                description: contentData.description,
                fileUrl: contentData.fileUrl,
                thumbnailUrl: contentData.thumbnailUrl,
                quizQuestions: contentData.quizQuestions
                  ? {
                      create: contentData.quizQuestions.map(
                        (q: QuizQuestionData) => ({
                          id: q.id || undefined,
                          question: q.question,
                          options: q.options,
                          correctAnswer: q.correctAnswer,
                        })
                      ),
                    }
                  : undefined,
                createdAt: new Date(contentData.createdAt),
                updatedAt: new Date(contentData.updatedAt),
                deletedAt: contentData.deletedAt
                  ? new Date(contentData.deletedAt)
                  : null,
              },
            }
          : undefined,
      },
      include: { content: { include: { quizQuestions: true } } },
    });

    return this._mapToLessonEntity(createdLesson);
  }

  async update(lesson: Lesson): Promise<Lesson> {
    const lessonData = lesson.toJSON() as unknown as LessonData;
    const contentData = lessonData.content;

    // Check if LessonContent exists before attempting delete
    const existingContent = await this._prisma.lessonContent.findUnique({
      where: { lessonId: lessonData.id },
    });

    const updatedLesson = await this._prisma.lesson.update({
      where: { id: lessonData.id },
      data: {
        title: lessonData.title,
        description: lessonData.description,
        order: lessonData.order,
        status: lessonData.status,
        updatedAt: new Date(lessonData.updatedAt),
        deletedAt: lessonData.deletedAt ? new Date(lessonData.deletedAt) : null,
        content: contentData
          ? {
              upsert: {
                where: { lessonId: lessonData.id },
                create: {
                  id: contentData.id || undefined,
                  type: contentData.type,
                  status: contentData.status,
                  title: contentData.title,
                  description: contentData.description,
                  fileUrl: contentData.fileUrl,
                  thumbnailUrl: contentData.thumbnailUrl,
                  quizQuestions: contentData.quizQuestions
                    ? {
                        create: contentData.quizQuestions.map(
                          (q: QuizQuestionData) => ({
                            id: q.id || undefined,
                            question: q.question,
                            options: q.options,
                            correctAnswer: q.correctAnswer,
                          })
                        ),
                      }
                    : undefined,
                  createdAt: new Date(contentData.createdAt),
                  updatedAt: new Date(contentData.updatedAt),
                  deletedAt: contentData.deletedAt
                    ? new Date(contentData.deletedAt)
                    : null,
                },
                update: {
                  type: contentData.type,
                  status: contentData.status,
                  title: contentData.title,
                  description: contentData.description,
                  fileUrl: contentData.fileUrl,
                  thumbnailUrl: contentData.thumbnailUrl,
                  quizQuestions: contentData.quizQuestions
                    ? {
                        deleteMany: {},
                        create: contentData.quizQuestions.map(
                          (q: QuizQuestionData) => ({
                            id: q.id || undefined,
                            question: q.question,
                            options: q.options,
                            correctAnswer: q.correctAnswer,
                          })
                        ),
                      }
                    : { deleteMany: {} },
                  updatedAt: new Date(contentData.updatedAt),
                  deletedAt: contentData.deletedAt
                    ? new Date(contentData.deletedAt)
                    : null,
                },
              },
            }
          : existingContent
          ? { delete: { lessonId: lessonData.id } }
          : undefined,
      },
      include: { content: { include: { quizQuestions: true } } },
    });

    return this._mapToLessonEntity(updatedLesson);
  }

  async delete(id: string): Promise<void> {
    await this._prisma.lesson.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async deletePermanently(id: string): Promise<void> {
    await this._prisma.$transaction(async (prisma) => {
      await prisma.lessonContent.deleteMany({
        where: { lessonId: id },
      });

      await prisma.lesson.delete({
        where: { id },
      });
    });
  }

  private _mapToLessonEntity(
    lesson: PrismaLesson & {
      content?: (PrismaLessonContent & { quizQuestions: Array<{ id: string; question: string; options: string[]; correctAnswer: string }> }) | null;
    }
  ): Lesson {
    return Lesson.fromPersistence({
      id: lesson.id,
      courseId: lesson.courseId,
      title: lesson.title,
      description: lesson.description,
      order: lesson.order,
      status: lesson.status as LessonStatus,
      content: lesson.content
        ? LessonContent.fromPersistence({
            id: lesson.content.id,
            lessonId: lesson.content.lessonId,
            type: lesson.content.type as ContentType,
            status: lesson.content.status as ContentStatus,
            title: lesson.content.title,
            description: lesson.content.description,
            fileUrl: lesson.content.fileUrl,
            thumbnailUrl: lesson.content.thumbnailUrl,
            quizQuestions: lesson.content.quizQuestions
              ? lesson.content.quizQuestions.map((q) => ({
                  id: q.id,
                  question: q.question,
                  options: q.options,
                  correctAnswer: q.correctAnswer,
                }))
              : null,
            createdAt: lesson.content.createdAt,
            updatedAt: lesson.content.updatedAt,
            deletedAt: lesson.content.deletedAt,
          })
        : null,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
      deletedAt: lesson.deletedAt,
    });
  }

  private _mapToLessonOutputDTO(
    lesson: PrismaLesson & {
      content?: (PrismaLessonContent & { quizQuestions: Array<{ id: string; question: string; options: string[]; correctAnswer: string }> }) | null;
    }
  ): ILessonOutputDTO {
    return {
      id: lesson.id,
      courseId: lesson.courseId,
      title: lesson.title,
      description: lesson.description,
      order: lesson.order,
      status: lesson.status as LessonStatus,
      content: lesson.content
        ? {
            id: lesson.content.id,
            lessonId: lesson.content.lessonId,
            type: lesson.content.type as ContentType,
            status: lesson.content.status as ContentStatus,
            title: lesson.content.title,
            description: lesson.content.description,
            fileUrl: lesson.content.fileUrl,
            thumbnailUrl: lesson.content.thumbnailUrl,
            quizQuestions: lesson.content.quizQuestions
              ? lesson.content.quizQuestions.map((q) => ({
                  id: q.id,
                  question: q.question,
                  options: q.options,
                  correctAnswer: q.correctAnswer,
                }))
              : null,
            createdAt: lesson.content.createdAt.toISOString(),
            updatedAt: lesson.content.updatedAt.toISOString(),
            deletedAt: lesson.content.deletedAt?.toISOString() ?? null,
          }
        : null,
      createdAt: lesson.createdAt.toISOString(),
      updatedAt: lesson.updatedAt.toISOString(),
      deletedAt: lesson.deletedAt?.toISOString() ?? null,
    };
  }

  async findByCourseIdAndOrder(
    courseId: string,
    order: number
  ): Promise<Lesson | null> {
    const lesson = await this._prisma.lesson.findFirst({
      where: {
        courseId,
        order,
      },
      include: { content: { include: { quizQuestions: true } } },
    });

    if (!lesson) {
      return null;
    }

    return this._mapToLessonEntity(lesson);
  }

  async hasPublishedLessons(courseId: string): Promise<boolean> {
    const count = await this._prisma.lesson.count({
      where: {
        courseId,
        status: LessonStatus.PUBLISHED,
        deletedAt: null,
      },
    });
    return count > 0;
  }

  async findByCourseId(courseId: string): Promise<Lesson[]> {
    const lessons = await this._prisma.lesson.findMany({
      where: {
        courseId,
        deletedAt: null,
        status: LessonStatus.PUBLISHED,
      },
      include: { content: { include: { quizQuestions: true } } },
      orderBy: { order: "asc" },
    });

    return lessons.map(this._mapToLessonEntity);
  }
}
