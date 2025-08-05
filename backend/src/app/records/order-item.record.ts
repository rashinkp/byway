export interface OrderItemRecord {
  id: string;
  orderId: string;
  courseId: string;
  coursePrice: number;
  adminSharePercentage: number;
  createdAt: Date;
  updatedAt: Date;
} 