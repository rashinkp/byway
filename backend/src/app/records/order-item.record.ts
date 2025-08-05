export interface OrderItemRecord {
  id: string;
  orderId: string;
  courseId: string;
  coursePrice: number;
  courseTitle: string;
  discount?: number | null;
  couponId?: string | null;
  adminSharePercentage: number;
  createdAt: Date;
  updatedAt: Date;
} 