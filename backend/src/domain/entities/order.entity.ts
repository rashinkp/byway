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
  private readonly _id: string;
  private _userId: string;
  private _status: OrderStatus;
  private _paymentStatus: PaymentStatus;
  private _paymentIntentId: string | null;
  private _paymentGateway: PaymentGateway | null;
  private _totalAmount: number;
  private _couponCode: string | null;
  private _items: OrderItem[];
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: {
    id: string;
    userId: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentIntentId?: string | null;
    paymentGateway?: PaymentGateway | null;
    totalAmount: number;
    couponCode?: string | null;
    items: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.validateOrder(props);
    
    this._id = props.id;
    this._userId = props.userId;
    this._status = props.status;
    this._paymentStatus = props.paymentStatus;
    this._paymentIntentId = props.paymentIntentId ?? null;
    this._paymentGateway = props.paymentGateway ?? null;
    this._totalAmount = props.totalAmount;
    this._couponCode = props.couponCode ?? null;
    this._items = props.items;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  private validateOrder(props: any): void {
    if (!props.id) {
      throw new Error("Order ID is required");
    }

    if (!props.userId) {
      throw new Error("User ID is required");
    }

    if (!props.status) {
      throw new Error("Order status is required");
    }

    if (!props.paymentStatus) {
      throw new Error("Payment status is required");
    }

    if (props.totalAmount < 0) {
      throw new Error("Total amount cannot be negative");
    }

    if (!props.items || props.items.length === 0) {
      throw new Error("Order must have at least one item");
    }
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get status(): OrderStatus {
    return this._status;
  }

  get paymentStatus(): PaymentStatus {
    return this._paymentStatus;
  }

  get paymentIntentId(): string | null {
    return this._paymentIntentId;
  }

  get paymentGateway(): PaymentGateway | null {
    return this._paymentGateway;
  }

  get totalAmount(): number {
    return this._totalAmount;
  }

  get couponCode(): string | null {
    return this._couponCode;
  }

  get items(): OrderItem[] {
    return this._items;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business logic methods
  updatePaymentStatus(status: PaymentStatus): void {
    this._paymentStatus = status;
    this._updatedAt = new Date();
  }

  updateOrderStatus(status: OrderStatus): void {
    this._status = status;
    this._updatedAt = new Date();
  }

  setPaymentIntent(paymentIntentId: string): void {
    this._paymentIntentId = paymentIntentId;
    this._updatedAt = new Date();
  }

  setPaymentGateway(gateway: PaymentGateway): void {
    this._paymentGateway = gateway;
    this._updatedAt = new Date();
  }

  isCompleted(): boolean {
    return this._paymentStatus === PaymentStatus.COMPLETED;
  }

  isPending(): boolean {
    return this._paymentStatus === PaymentStatus.PENDING;
  }

  isFailed(): boolean {
    return this._paymentStatus === PaymentStatus.FAILED;
  }

  isRefunded(): boolean {
    return this._paymentStatus === PaymentStatus.REFUNDED;
  }

  canBeRefunded(): boolean {
    return this.isCompleted() && !this.isRefunded();
  }

  hasCoupon(): boolean {
    return this._couponCode !== null && this._couponCode.trim() !== "";
  }

  hasPaymentIntent(): boolean {
    return this._paymentIntentId !== null;
  }

  getItemCount(): number {
    return this._items.length;
  }
} 