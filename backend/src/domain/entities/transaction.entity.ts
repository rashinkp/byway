import { PaymentGateway } from "../enum/payment-gateway.enum";
import { TransactionStatus } from "../enum/transaction-status.enum";
import { TransactionType } from "../enum/transaction-type.enum";

interface TransactionProps {
  id: string;
  orderId?: string | null;
  userId: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  paymentGateway: PaymentGateway;
  paymentMethod?: string | null;
  paymentDetails?: Record<string, any> | null;
  courseId?: string | null;
  transactionId?: string | null;
  metadata?: Record<string, any> | null;
  walletId?: string | null;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class Transaction {
  private readonly _id: string;
  private readonly _orderId: string | null;
  private readonly _userId: string;
  private readonly _amount: number;
  private readonly _type: TransactionType;
  private _status: TransactionStatus;
  private readonly _paymentGateway: PaymentGateway;
  private readonly _paymentMethod: string | null;
  private readonly _paymentDetails: Record<string, any> | null;
  private readonly _courseId: string | null;
  private readonly _transactionId: string | null;
  private readonly _metadata: Record<string, any> | null;
  private readonly _walletId: string | null;
  private readonly _description: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  constructor(props: TransactionProps) {
    if (!props.userId) {
      throw new Error("User ID is required");
    }
    if (props.amount < 0) {
      throw new Error("Amount cannot be negative");
    }

    this._id = props.id;
    this._orderId = props.orderId ?? null;
    this._userId = props.userId;
    this._amount = props.amount;
    this._type = props.type;
    this._status = props.status;
    this._paymentGateway = props.paymentGateway;
    this._paymentMethod = props.paymentMethod ?? null;
    this._paymentDetails = props.paymentDetails ?? null;
    this._courseId = props.courseId ?? null;
    this._transactionId = props.transactionId ?? null;
    this._metadata = props.metadata ?? null;
    this._walletId = props.walletId ?? null;
    this._description = props.description ? props.description.trim() : null;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt ?? null;
  }

  setStatus(status: TransactionStatus): void {
    if (this._deletedAt) {
      throw new Error("Cannot change status of a deleted transaction");
    }
    if (this._status === status) {
      throw new Error(`Transaction is already ${status}`);
    }
    this._status = status;
    this._updatedAt = new Date();
  }

  softDelete(): void {
    if (this._deletedAt) {
      throw new Error("Transaction is already deleted");
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  recover(): void {
    if (!this._deletedAt) {
      throw new Error("Transaction is not deleted");
    }
    this._deletedAt = null;
    this._updatedAt = new Date();
  }

  isActive(): boolean {
    return !this._deletedAt;
  }

  isCompleted(): boolean {
    return this._status === TransactionStatus.COMPLETED && !this._deletedAt;
  }

  isPending(): boolean {
    return this._status === TransactionStatus.PENDING && !this._deletedAt;
  }

  isFailed(): boolean {
    return this._status === TransactionStatus.FAILED && !this._deletedAt;
  }

  isRefunded(): boolean {
    return this._status === TransactionStatus.REFUNDED && !this._deletedAt;
  }

  isCancelled(): boolean {
    return this._status === TransactionStatus.CANCELLED && !this._deletedAt;
  }

  isPayment(): boolean {
    return this._type === TransactionType.PURCHASE;
  }

  isRefund(): boolean {
    return this._type === TransactionType.REFUND;
  }

  get id(): string {
    return this._id;
  }

  get orderId(): string | null {
    return this._orderId;
  }

  get userId(): string {
    return this._userId;
  }

  get amount(): number {
    return this._amount;
  }

  get type(): TransactionType {
    return this._type;
  }

  get status(): TransactionStatus {
    return this._status;
  }

  get paymentGateway(): PaymentGateway {
    return this._paymentGateway;
  }

  get paymentMethod(): string | null {
    return this._paymentMethod;
  }

  get paymentDetails(): Record<string, any> | null {
    return this._paymentDetails;
  }

  get courseId(): string | null {
    return this._courseId;
  }

  get transactionId(): string | null {
    return this._transactionId;
  }

  get metadata(): Record<string, any> | null {
    return this._metadata;
  }

  get walletId(): string | null {
    return this._walletId;
  }

  get description(): string | null {
    return this._description;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }
}
