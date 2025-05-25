import { OrderStatus } from "../enum/order-status.enum";
import { PaymentGateway } from "../enum/payment-gateway.enum";
import { PaymentStatus } from "../enum/payment-status.enum";

export class Order {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly status: OrderStatus,
    public readonly paymentStatus: PaymentStatus,
    public readonly paymentIntentId: string | null,
    public readonly paymentGateway: PaymentGateway | null,
    public readonly totalAmount: number,
    public readonly couponCode: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
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
} 