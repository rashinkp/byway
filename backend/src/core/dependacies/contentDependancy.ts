import { ContentController } from "../../modules/content/content.controller";
import { ContentRepository } from "../../modules/content/content.repository";
import { ContentService } from "../../modules/content/content.service";
import { CourseRepository } from "../../modules/course/course.repository";
import { CourseService } from "../../modules/course/course.service";
import { EnrollmentService } from "../../modules/enrollment/enrollment.service";
import { LessonRepository } from "../../modules/lesson/lesson.repository";
import { LessonService } from "../../modules/lesson/lesson.service";
import { IDatabaseProvider } from "../database";





export interface ContentDependencies {
  contentController: ContentController;
  setEnrollmentService: (enrollmentService: EnrollmentService) => void;
}


export const initializeContentDependencies = (
  dbProvider: IDatabaseProvider,
  lessonService: LessonService,
  courseService: CourseService,
): ContentDependencies => {
  const prisma = dbProvider.getClient();
  let enrollmentService : EnrollmentService | undefined
  const contentRepository = new ContentRepository(prisma);
  const contentService = new ContentService(
    contentRepository,
    lessonService,
    courseService,
    enrollmentService!
  );
  const contentController = new ContentController(contentService);

  return {
    contentController,
    setEnrollmentService: (service: EnrollmentService) => {
      enrollmentService = service;
      Object.assign(contentService , {enrollmentService})
    }
   };
}