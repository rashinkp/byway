export interface ILesson {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface ICreateLessonInput {
  courseId: string;
  title: string;
  description?: string;
  order: number;
  thumbnail?: string;
}

export interface IUserLessonProgress {
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateLessonProgressInput {
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
}

export interface IGetProgressInput {
  userId: string;
  courseId: string;
}



export enum ContentType {
  VIDEO = "VIDEO",
  DOCUMENT = "DOCUMENT",
  QUIZ = "QUIZ",
}

// export enum ContentStatus {
//   DRAFT = "DRAFT",
//   PROCESSING = "PROCESSING",
//   PUBLISHED = "PUBLISHED",
// }

// export interface ILessonContent {
//   id: string;
//   lessonId: string;
//   type: ContentType;
//   status: ContentStatus;
//   data: Record<string, any>; 
//   createdAt: Date;
//   updatedAt: Date;
//   deletedAt?: Date | null;
// }

// export interface ICreateLessonContentInput {
//   lessonId: string;
//   type: ContentType;
//   status?: ContentStatus; 
//   data: Record<string, any>;
// }