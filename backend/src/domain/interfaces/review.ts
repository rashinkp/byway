import { Rating } from "../value-object/rating";

export interface CourseReviewProps {
  id?: string;
  courseId: string;
  userId: string;
  rating: Rating;
  title?: string | null;
  comment?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
