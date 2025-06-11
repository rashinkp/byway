import { PaymentGateway } from "../enum/payment-gateway.enum";
import { TransactionStatus } from "../enum/transaction-status.enum";
import { TransactionType } from "../enum/transaction-type.enum";

export class Transaction {
  private readonly _id: string;
  private readonly _orderId?: string;
  private readonly _userId: string;
  private readonly _amount: number;
  private readonly _type: TransactionType;
  private readonly _status: TransactionStatus;
  private readonly _paymentGateway: PaymentGateway;
  private readonly _paymentMethod?: string;
  private readonly _paymentDetails?: Record<string, any>;
  private readonly _courseId?: string;
  private readonly _transactionId?: string;
  private readonly _metadata?: Record<string, any>;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;
  private readonly _walletId?: string;
  private readonly _description?: string;

  constructor(params: {
    id?: string;
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
    createdAt?: Date;
    updatedAt?: Date;
    description?: string;
  }) {
    console.log("Creating Transaction entity with params:", {
      orderId: params.orderId,
      userId: params.userId,
      amount: params.amount,
      type: params.type,
      status: params.status,
      paymentGateway: params.paymentGateway,
      transactionId: params.transactionId,
    });

    this._id = params.id || crypto.randomUUID();
    this._orderId = params.orderId;
    this._userId = params.userId;
    this._amount = params.amount;
    this._type = params.type;
    this._status = params.status;
    this._paymentGateway = params.paymentGateway;
    this._paymentMethod = params.paymentMethod;
    this._paymentDetails = params.paymentDetails;
    this._courseId = params.courseId;
    this._transactionId = params.transactionId;
    this._metadata = params.metadata;
    this._walletId = params.walletId;
    this._createdAt = params.createdAt || new Date();
    this._updatedAt = params.updatedAt || new Date();
    this._description = params.description;

    console.log("Transaction entity created:", {
      id: this._id,
      orderId: this._orderId,
      amount: this._amount,
      status: this._status,
    });
  }

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

  get isCompleted(): boolean {
    return this._status === TransactionStatus.COMPLETED;
  }

  get isPending(): boolean {
    return this._status === TransactionStatus.PENDING;
  }

  get isFailed(): boolean {
    return this._status === TransactionStatus.FAILED;
  }

  get isRefunded(): boolean {
    return this._status === TransactionStatus.REFUNDED;
  }

  get isCancelled(): boolean {
    return this._status === TransactionStatus.CANCELLED;
  }

  get isPayment(): boolean {
    return this._type === TransactionType.PURCHASE;
  }

  get isRefund(): boolean {
    return this._type === TransactionType.REFUND;
  }

  get walletId(): string | undefined {
    return this._walletId;
  }

  get description(): string | undefined {
    return this._description;
  }

  static create(data: {
    id?: string;
    orderId?: string;
    userId: string;
    walletId?: string;
    courseId?: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    paymentGateway: PaymentGateway;
    transactionId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    description?: string;
  }): Transaction {
    return new Transaction({
      id: data.id,
      orderId: data.orderId,
      userId: data.userId,
      walletId: data.walletId,
      courseId: data.courseId,
      amount: data.amount,
      type: data.type,
      status: data.status,
      paymentGateway: data.paymentGateway,
      transactionId: data.transactionId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      description: data.description
    });
  }
}
