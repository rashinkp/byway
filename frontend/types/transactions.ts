export interface Transaction {
  id: string;
  orderId: string;
  userId: string;
  courseId: string | null;
  amount: number;
  type: "PAYMENT" | "REFUND" | "DEPOSIT" | "WITHDRAWAL" | "PURCHASE";
  status: "PENDING" | "COMPLETED" | "FAILED";
  paymentGateway: "STRIPE" | "PAYPAL" | "RAZORPAY" | null;
  transactionId: string | null;
  createdAt: string;
  description: string; 
}

