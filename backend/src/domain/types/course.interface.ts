import { APPROVALSTATUS } from "../enum/approval-status.enum";
import { CourseLevel } from "../enum/course-level.enum";
import { CourseStatus } from "../enum/course-status.enum";
import { RatingLevel } from "../enum/rating-level.enum";



export interface ICourseReviewStatsDetailed {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key in RatingLevel]: number;
  };
  ratingPercentages: {
    [key in RatingLevel]: number;
  };
}



export interface ICourseInstructor {
  id: string;
  name: string;
  bio: string | null;
  profilePicture: string | null;
  expertise: string[];
}

export interface ICourseReviewStats {
  averageRating: number;
  totalReviews: number;
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
}


export interface ICourse {
  id: string;
  title: string;
  description: string | null;
  level: CourseLevel;
  price: number | null;
  thumbnail: string | null;
  duration: number | null;
  offer: number | null;
  status: CourseStatus;
  categoryId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  approvalStatus: APPROVALSTATUS;
  adminSharePercentage: number;
  instructorSharePercentage: number;
  details: {
    prerequisites: string | null;
    longDescription: string | null;
    objectives: string | null;
    targetAudience: string | null;
  } | null;
  rating?: number;
  reviewCount?: number;
  formattedDuration?: string;
  lessons?: number;
  bestSeller?: boolean;
  progress?: number;
  completedLessons?: number;
  totalLessons?: number;
  lastAccessed?: string;
  isEnrolled?: boolean;
  reviewStats?: ICourseReviewStatsDetailed;
}



export interface CourseWithEnrollment
  extends Omit<
    ICourse,
    "createdAt" | "updatedAt" | "deletedAt" | "reviewStats"
  > {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  isEnrolled: boolean;
  isInCart: boolean;
  instructor: ICourseInstructor;
  reviewStats: ICourseReviewStats;
}



export interface CourseStatsInput {
  userId?: string;
  includeDeleted?: boolean;
  isAdmin?: boolean;
}
