import { Course } from "./course.entity";
import { OrderStatus } from "../enum/order-status.enum";
import { PaymentGateway } from "../enum/payment-gateway.enum";
import { PaymentStatus } from "../enum/payment-status.enum";

interface OrderItemProps {
  id: string;
  orderId: string;
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  discount?: number | null;
  couponId?: string | null;
  course: Course;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class OrderItem {
  private readonly _id: string;
  private readonly _orderId: string;
  private readonly _courseId: string;
  private readonly _courseTitle: string;
  private readonly _coursePrice: number;
  private readonly _discount: number | null;
  private readonly _couponId: string | null;
  private readonly _course: Course;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  constructor(props: OrderItemProps) {
    if (!props.orderId) {
      throw new Error("Order ID is required");
    }
    if (!props.courseId) {
      throw new Error("Course ID is required");
    }
    if (!props.courseTitle || props.courseTitle.trim() === "") {
      throw new Error("Course title is required and cannot be empty");
    }
    if (props.coursePrice < 0) {
      throw new Error("Course price cannot be negative");
    }
    if (props.discount && props.discount < 0) {
      throw new Error("Discount cannot be negative");
    }

    this._id = props.id;
    this._orderId = props.orderId;
    this._courseId = props.courseId;
    this._courseTitle = props.courseTitle.trim();
    this._coursePrice = props.coursePrice;
    this._discount = props.discount ?? null;
    this._couponId = props.couponId ?? null;
    this._course = props.course;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt ?? null;
  }

  softDelete(): void {
    if (this._deletedAt) {
      throw new Error("Order item is already deleted");
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  recover(): void {
    if (!this._deletedAt) {
      throw new Error("Order item is not deleted");
    }
    this._deletedAt = null;
    this._updatedAt = new Date();
  }

  isActive(): boolean {
    return !this._deletedAt;
  }

  get id(): string {
    return this._id;
  }

  get orderId(): string {
    return this._orderId;
  }

  get courseId(): string {
    return this._courseId;
  }

  get courseTitle(): string {
    return this._courseTitle;
  }

  get coursePrice(): number {
    return this._coursePrice;
  }

  get discount(): number | null {
    return this._discount;
  }

  get couponId(): string | null {
    return this._couponId;
  }

  get course(): Course {
    return this._course;
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

interface OrderProps {
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
  deletedAt?: Date | null;
}

export class Order {
  private readonly _id: string;
  private readonly _userId: string;
  private _status: OrderStatus;
  private _paymentStatus: PaymentStatus;
  private readonly _paymentIntentId: string | null;
  private readonly _paymentGateway: PaymentGateway | null;
  private readonly _totalAmount: number;
  private readonly _couponCode: string | null;
  private readonly _items: ReadonlyArray<OrderItem>;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  constructor(props: OrderProps) {
    if (!props.userId) {
      throw new Error("User ID is required");
    }
    if (props.totalAmount < 0) {
      throw new Error("Total amount cannot be negative");
    }
    if (props.items.length === 0) {
      throw new Error("Order must have at least one item");
    }

    this._id = props.id;
    this._userId = props.userId;
    this._status = props.status;
    this._paymentStatus = props.paymentStatus;
    this._paymentIntentId = props.paymentIntentId ?? null;
    this._paymentGateway = props.paymentGateway ?? null;
    this._totalAmount = props.totalAmount;
    this._couponCode = props.couponCode ?? null;
    this._items = [...props.items];
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt ?? null;
  }

  setPaymentStatus(status: PaymentStatus): void {
    if (this._deletedAt) {
      throw new Error("Cannot change payment status of a deleted order");
    }
    if (this._paymentStatus === status) {
      throw new Error(`Order is already ${status}`);
    }
    this._paymentStatus = status;
    this._updatedAt = new Date();
  }

  setOrderStatus(status: OrderStatus): void {
    if (this._deletedAt) {
      throw new Error("Cannot change order status of a deleted order");
    }
    if (this._status === status) {
      throw new Error(`Order is already ${status}`);
    }
    this._status = status;
    this._updatedAt = new Date();
  }

  softDelete(): void {
    if (this._deletedAt) {
      throw new Error("Order is already deleted");
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  recover(): void {
    if (!this._deletedAt) {
      throw new Error("Order is not deleted");
    }
    this._deletedAt = null;
    this._updatedAt = new Date();
  }

  isActive(): boolean {
    return !this._deletedAt;
  }

  isCompleted(): boolean {
    return this._paymentStatus === PaymentStatus.COMPLETED && !this._deletedAt;
  }

  isPending(): boolean {
    return this._paymentStatus === PaymentStatus.PENDING && !this._deletedAt;
  }

  isFailed(): boolean {
    return this._paymentStatus === PaymentStatus.FAILED && !this._deletedAt;
  }

  isRefunded(): boolean {
    return this._paymentStatus === PaymentStatus.REFUNDED && !this._deletedAt;
  }

  canBeRefunded(): boolean {
    return this.isCompleted() && !this.isRefunded() && !this._deletedAt;
  }

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

  get items(): ReadonlyArray<OrderItem> {
    return this._items;
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
