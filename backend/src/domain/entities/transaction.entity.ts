import { TransactionType } from "../enum/transaction-type.enum";
import { TransactionStatus } from "../enum/transaction-status.enum";
import { PaymentGateway } from "../enum/payment-gateway.enum";

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly userId: string,
    public readonly courseId: string,
    public readonly amount: number,
    public readonly type: TransactionType,
    public readonly status: TransactionStatus,
    public readonly paymentGateway: PaymentGateway,
    public readonly transactionId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  // Domain methods
  public isCompleted(): boolean {
    return this.status === TransactionStatus.COMPLETED;
  }

  public isPending(): boolean {
    return this.status === TransactionStatus.PENDING;
  }

  public isFailed(): boolean {
    return this.status === TransactionStatus.FAILED;
  }

  public isPayment(): boolean {
    return this.type === TransactionType.PAYMENT;
  }

  public isRefund(): boolean {
    return this.type === TransactionType.REFUND;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getTransactionId(): string {
    return this.transactionId;
  }

  public getPaymentGateway(): PaymentGateway {
    return this.paymentGateway;
  }
} 