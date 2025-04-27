import { ContentController } from "../../modules/content/content.controller";
import { ContentRepository } from "../../modules/content/content.repository";
import { ContentService } from "../../modules/content/content.service";
import { LessonRepository } from "../../modules/lesson/lesson.repository";
import { IDatabaseProvider } from "../database";





export interface ContentDependencies {
  contentController: ContentController;
}


export const initializeContentDependencies = (
  dbProvider: IDatabaseProvider,
  lessonRepository: LessonRepository
): ContentDependencies => {
  const prisma = dbProvider.getClient();
  const contentRepository = new ContentRepository(prisma);
  const contentService = new ContentService(contentRepository, lessonRepository, prisma);
  const contentController = new ContentController(contentService);

  return { contentController };
}