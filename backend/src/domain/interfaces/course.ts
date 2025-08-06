import { CourseDetails } from "../entities/course.entity";
import { APPROVALSTATUS } from "../enum/approval-status.enum";
import { CourseLevel } from "../enum/course-level.enum";
import { CourseStatus } from "../enum/course-status.enum";
import { Duration } from "../value-object/duration";
import { Offer } from "../value-object/offer";
import { Price } from "../value-object/price";

// Interface for Course properties
export interface CourseProps {
  id: string;
  title: string;
  description?: string | null;
  level: CourseLevel;
  price?: Price | null;
  thumbnail?: string | null;
  duration?: Duration | null;
  offer?: Offer | null;
  status: CourseStatus;
  categoryId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  approvalStatus: APPROVALSTATUS;
  adminSharePercentage: number;
  details?: CourseDetails | null;
  rating?: number;
  reviewCount?: number;
  lessons?: number;
  bestSeller?: boolean;
}