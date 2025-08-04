import { PaymentGateway } from "../enum/payment-gateway.enum";
import { TransactionStatus } from "../enum/transaction-status.enum";
import { TransactionType } from "../enum/transaction-type.enum";

export class Transaction {
  private readonly _id: string;
  private _orderId?: string;
  private _userId: string;
  private _amount: number;
  private _type: TransactionType;
  private _status: TransactionStatus;
  private _paymentGateway: PaymentGateway;
  private _paymentMethod?: string;
  private _paymentDetails?: Record<string, any>;
  private _courseId?: string;
  private _transactionId?: string;
  private _metadata?: Record<string, any>;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _walletId?: string;
  private _description?: string;

  constructor(props: {
    id: string;
    orderId?: string;
    userId: string;
    walletId?: string;
    courseId?: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    paymentGateway: PaymentGateway;
    paymentMethod?: string;
    paymentDetails?: Record<string, any>;
    transactionId?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    description?: string;
  }) {
    this.validateTransaction(props);
    
    this._id = props.id;
    this._orderId = props.orderId;
    this._userId = props.userId;
    this._amount = props.amount;
    this._type = props.type;
    this._status = props.status;
    this._paymentGateway = props.paymentGateway;
    this._paymentMethod = props.paymentMethod;
    this._paymentDetails = props.paymentDetails;
    this._courseId = props.courseId;
    this._transactionId = props.transactionId;
    this._metadata = props.metadata;
    this._walletId = props.walletId;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._description = props.description;
  }

  private validateTransaction(props: any): void {
    if (!props.id) {
      throw new Error("Transaction ID is required");
    }

    if (!props.userId) {
      throw new Error("User ID is required");
    }

    if (props.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    if (!props.type) {
      throw new Error("Transaction type is required");
    }

    if (!props.status) {
      throw new Error("Transaction status is required");
    }

    if (!props.paymentGateway) {
      throw new Error("Payment gateway is required");
    }
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get orderId(): string | undefined {
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

  get paymentMethod(): string | undefined {
    return this._paymentMethod;
  }

  get paymentDetails(): Record<string, any> | undefined {
    return this._paymentDetails;
  }

  get courseId(): string | undefined {
    return this._courseId;
  }

  get transactionId(): string | undefined {
    return this._transactionId;
  }

  get metadata(): Record<string, any> | undefined {
    return this._metadata;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get walletId(): string | undefined {
    return this._walletId;
  }

  get description(): string | undefined {
    return this._description;
  }

  // Business logic methods
  updateStatus(status: TransactionStatus): void {
    this._status = status;
    this._updatedAt = new Date();
  }

  setTransactionId(transactionId: string): void {
    this._transactionId = transactionId;
    this._updatedAt = new Date();
  }

  setPaymentDetails(details: Record<string, any>): void {
    this._paymentDetails = details;
    this._updatedAt = new Date();
  }

  setMetadata(metadata: Record<string, any>): void {
    this._metadata = metadata;
    this._updatedAt = new Date();
  }

  isCompleted(): boolean {
    return this._status === TransactionStatus.COMPLETED;
  }

  isPending(): boolean {
    return this._status === TransactionStatus.PENDING;
  }

  isFailed(): boolean {
    return this._status === TransactionStatus.FAILED;
  }

  isRefunded(): boolean {
    return this._status === TransactionStatus.REFUNDED;
  }

  isCancelled(): boolean {
    return this._status === TransactionStatus.CANCELLED;
  }

  isPayment(): boolean {
    return this._type === TransactionType.PAYMENT;
  }

  isRefund(): boolean {
    return this._type === TransactionType.REFUND;
  }

  hasOrder(): boolean {
    return this._orderId !== undefined;
  }

  hasCourse(): boolean {
    return this._courseId !== undefined;
  }

  hasWallet(): boolean {
    return this._walletId !== undefined;
  }

  hasTransactionId(): boolean {
    return this._transactionId !== undefined;
  }
}
