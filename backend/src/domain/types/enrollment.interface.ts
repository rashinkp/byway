export interface IEnrollmentWithDetails {
  userId: string;
  courseId: string;
  enrolledAt: Date;
  orderItemId?: string;
  accessStatus: "ACTIVE" | "BLOCKED" | "EXPIRED";
}

export interface ICreateEnrollmentInput {
  userId: string;
  courseIds: string[];
  orderItemId?: string;
}

export interface IEnrollmentStats {
  totalEnrollments: number;
}

export interface IGetEnrollmentStatsInput {
  userId?: string;
  courseId?: string;
  startDate?: Date;
  endDate?: Date;
}
