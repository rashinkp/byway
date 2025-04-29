import { ContentController } from "../../modules/content/content.controller";
import { ContentRepository } from "../../modules/content/content.repository";
import { ContentService } from "../../modules/content/content.service";
import { CourseRepository } from "../../modules/course/course.repository";
import { CourseService } from "../../modules/course/course.service";
import { LessonRepository } from "../../modules/lesson/lesson.repository";
import { LessonService } from "../../modules/lesson/lesson.service";
import { IDatabaseProvider } from "../database";





export interface ContentDependencies {
  contentController: ContentController;
}


export const initializeContentDependencies = (
  dbProvider: IDatabaseProvider,
  lessonService: LessonService,
  courseService: CourseService,
): ContentDependencies => {
  const prisma = dbProvider.getClient();
  const contentRepository = new ContentRepository(prisma);
  const contentService = new ContentService(
    contentRepository,
    lessonService,
    courseService,
  );
  const contentController = new ContentController(contentService);

  return { contentController };
}