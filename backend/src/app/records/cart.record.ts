export interface CartRecord {
  id: string;
  userId: string;
  courseId: string;
  couponId?: string | null;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
} 