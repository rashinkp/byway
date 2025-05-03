import { CourseService } from "../course/course.service";
import { LessonService } from "../lesson/lesson.service";
import { IContentRepository } from "./content.repository.interface";
import {
  ICreateLessonContentInput,
  IUpdateLessonContentInput,
  ILessonContent,
} from "./content.types";

export class ContentService {
  constructor(
    private contentRepository: IContentRepository,
    private lessonService: LessonService,
    private courseService: CourseService
  ) {}

  async createContent(
    input: ICreateLessonContentInput,
    userId: string
  ): Promise<ILessonContent> {
    const { lessonId, type, title } = input;

    // Validate input
    if (!lessonId || !type || !title) {
      throw new Error("Lesson ID, type, and title are required");
    }

    // Validate lesson exists and isn't deleted
    const lesson = await this.lessonService.getLessonById(lessonId);
    if (!lesson || lesson.deletedAt) {
      throw new Error("Lesson not found or deleted");
    }

    // Check if user is the course creator
    const course = await this.courseService.getCourseById(lesson.courseId);
    if (!course) {
      throw new Error("Course not found");
    }
    if (course.createdBy !== userId) {
      throw new Error(
        "Unauthorized: You can only add content to your own courses"
      );
    }

    // Check if content already exists for this lesson
    const existingContent = await this.contentRepository.getContentByLessonId(
      lessonId
    );
    if (existingContent && !existingContent.deletedAt) {
      throw new Error("Content already exists for this lesson");
    }

    return this.contentRepository.createContent(input);
  }

  async getContentByLessonId(
    lessonId: string,
    userId: string
  ): Promise<ILessonContent | null> {
    // Validate lesson exists and isn't deleted
    const lesson = await this.lessonService.getLessonById(lessonId);
    if (!lesson || lesson.deletedAt) {
      throw new Error("Lesson not found or deleted");
    }

    // Check if user is enrolled or the course creator
    const course = await this.courseService.getCourseById(lesson.courseId);
    if (!course) {
      throw new Error("Course not found");
    }
    const isCreator = course.createdBy === userId;
    // const enrollment = await this.courseService.getEnrollment(
    //   userId,
    //   lesson.courseId
    // );
    if (!isCreator) {
      throw new Error("You are not enrolled in this course or not the creator");
    }

    return this.contentRepository.getContentByLessonId(lessonId);
  }

  async updateContent(
    id: string,
    input: IUpdateLessonContentInput,
    userId: string
  ): Promise<ILessonContent> {
    // Validate input
    if (!input.lessonId) {
      throw new Error("Lesson ID is required");
    }

    // Fetch content by ID
    const content = await this.contentRepository.getContentById(id);
    if (!content || content.deletedAt) {
      throw new Error("Content not found or deleted");
    }

    // Validate lesson consistency
    if (content.lessonId !== input.lessonId) {
      throw new Error("Lesson ID cannot be changed");
    }

    // Validate lesson exists
    const lesson = await this.lessonService.getLessonById(content.lessonId);
    if (!lesson || lesson.deletedAt) {
      throw new Error("Lesson not found or deleted");
    }

    // Check if user is the course creator
    const course = await this.courseService.getCourseById(lesson.courseId);
    if (!course || course.createdBy !== userId) {
      throw new Error(
        "Unauthorized: You can only update content for your own courses"
      );
    }

    return this.contentRepository.updateContent({...input ,id });
  }

  async deleteContent(id: string, userId: string): Promise<void> {
    const content = await this.contentRepository.getContentById(id);
    if (!content) {
      throw new Error("Content not found or already deleted");
    }

    const lesson = await this.lessonService.getLessonById(content.lessonId);
    if (!lesson || lesson.deletedAt) {
      throw new Error("Lesson not found or deleted");
    }

    const course = await this.courseService.getCourseById(lesson.courseId);
    if (!course || course.createdBy !== userId) {
      throw new Error(
        "Unauthorized: You can only delete content for your own courses"
      );
    }



    await this.contentRepository.deleteContent(id);
    await this.lessonService.updateLesson(lesson.id, { status: 'DRAFT' })
    const isValid = await this.lessonService.isCourseValidForPublishment(course.id);


    if (!isValid) {
      await this.courseService.updateCourse({id:course.id , createdBy:userId , status:'DRAFT'})
    }
  }

  async getContentById(id: string): Promise<ILessonContent | null> {
    return this.contentRepository.getContentById(id);
  }
}
