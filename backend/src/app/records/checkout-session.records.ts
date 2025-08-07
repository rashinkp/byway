import { CheckoutSessionStatus } from "@/domain/enum/checkout-session.enum";


export interface CheckoutSessionRecord {
  id: string;
  sessionId: string;
  userId: string;
  courseId: string;
  status: CheckoutSessionStatus;
  createdAt: Date;
  updatedAt: Date;
}


export interface CheckoutSessionInput {
  sessionId: string;
  userId: string;
  courseId: string;
  status: CheckoutSessionStatus; 
}