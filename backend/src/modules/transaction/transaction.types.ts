export interface ITransaction {
  id: string;
  orderId: string;
  userId: string;
  courseId: string | null;
  amount: number;
  type: "PAYMENT" | "REFUND";
  status: "PENDING" | "COMPLETED" | "FAILED";
  paymentGateway: "STRIPE" | "PAYPAL" | "RAZORPAY" | null;
  transactionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
