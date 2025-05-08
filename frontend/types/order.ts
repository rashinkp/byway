export interface OrderItem {
  id: string;
  orderId: string;
  courseId: string;
  coursePrice: number;
  discount: number | null;
  couponId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  amount: number;
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  orderStatus: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
  items: OrderItem[];
}
