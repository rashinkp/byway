import { Course } from "./cart";

export type PaymentMethodType = "WALLET" | "STRIPE" | "PAYPAL";

export interface OrderDetailsProps {
  courseDetails: Course[];
}
