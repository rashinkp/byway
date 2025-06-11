import { OrderStatus } from "../enum/order-status.enum";
import { PaymentGateway } from "../enum/payment-gateway.enum";
import { PaymentStatus } from "../enum/payment-status.enum";

export interface OrderItem {
  orderId: string;
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  discount: number | null;
  couponId: string | null;
  title: string;
  description: string | null;
  level: string;
  price: number | null;
  thumbnail: string | null;
  status: string;
  categoryId: string;
  createdBy: string;
  deletedAt: string | null;
  approvalStatus: string;
  details: any | null;
}

export class Order {
  public id?: string;

  constructor(
    public readonly userId: string,
    public readonly status: OrderStatus,
    public readonly paymentStatus: PaymentStatus,
    public readonly paymentIntentId: string | null,
    public readonly paymentGateway: PaymentGateway | null,
    public readonly totalAmount: number,
    public readonly couponCode: string | null,
    public readonly items: OrderItem[]
  ) {}

  // Domain methods
  public isCompleted(): boolean {
    return this.paymentStatus === PaymentStatus.COMPLETED;
  }

  public isPending(): boolean {
    return this.paymentStatus === PaymentStatus.PENDING;
  }

  public isFailed(): boolean {
    return this.paymentStatus === PaymentStatus.FAILED;
  }

  public isRefunded(): boolean {
    return this.paymentStatus === PaymentStatus.REFUNDED;
  }

  public canBeRefunded(): boolean {
    return this.isCompleted() && !this.isRefunded();
  }

  public getPaymentGateway(): PaymentGateway | null {
    return this.paymentGateway;
  }

  public getTotalAmount(): number {
    return this.totalAmount;
  }

  public getCouponCode(): string | null {
    return this.couponCode;
  }

  public getItems(): OrderItem[] {
    return this.items;
  }

  toJSON(): any {
    return {
      id: this.id,
      userId: this.userId,
      amount: this.totalAmount,
      paymentStatus: this.paymentStatus,
      orderStatus: this.status,
      paymentId: this.paymentIntentId,
      paymentGateway: this.paymentGateway,
      items: this.items,
    };
  }
} 