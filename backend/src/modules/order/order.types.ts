export interface IOrderItem {
  id: string;
  orderId: string;
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  discount: number | null;
  couponId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder {
  id: string;
  userId: string;
  amount: number;
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  paymentGateway: "STRIPE" | "PAYPAL" | "RAZORPAY" | null;
  paymentId: string | null;
  orderStatus: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  items: IOrderItem[];
}

export interface ICourseInput {
  id: string;
  title: string;
  description?: string;
  price: number;
  offer?: number;
  thumbnail?: string;
  duration?: string;
  level?: string;
}
