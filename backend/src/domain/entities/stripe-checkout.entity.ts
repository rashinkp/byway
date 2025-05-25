import { PaymentStatus } from "../enum/payment-status.enum";

export class StripeCheckout {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly orderId: string,
    public readonly sessionId: string,
    public readonly paymentIntentId: string,
    public readonly status: PaymentStatus,
    public readonly amount: number,
    public readonly currency: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  // Domain methods
  public isCompleted(): boolean {
    return this.status === PaymentStatus.COMPLETED;
  }

  public isPending(): boolean {
    return this.status === PaymentStatus.PENDING;
  }

  public isFailed(): boolean {
    return this.status === PaymentStatus.FAILED;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getCurrency(): string {
    return this.currency;
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getPaymentIntentId(): string {
    return this.paymentIntentId;
  }
} 