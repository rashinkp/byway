import { Course } from "./course.entity";

export class OrderItem {
  private readonly _id: string;
  private _orderId: string;
  private _courseId: string;
  private _courseTitle: string;
  private _coursePrice: number;
  private _discount: number | null;
  private _couponId: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: {
    id: string;
    orderId: string;
    courseId: string;
    courseTitle: string;
    coursePrice: number;
    discount?: number | null;
    couponId?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.validateOrderItem(props);
    
    this._id = props.id;
    this._orderId = props.orderId;
    this._courseId = props.courseId;
    this._courseTitle = props.courseTitle;
    this._coursePrice = props.coursePrice;
    this._discount = props.discount ?? null;
    this._couponId = props.couponId ?? null;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  private validateOrderItem(props: any): void {
    if (!props.id) {
      throw new Error("Order item ID is required");
    }

    if (!props.orderId) {
      throw new Error("Order ID is required");
    }

    if (!props.courseId) {
      throw new Error("Course ID is required");
    }

    if (!props.courseTitle || props.courseTitle.trim() === "") {
      throw new Error("Course title is required");
    }

    if (props.coursePrice < 0) {
      throw new Error("Course price cannot be negative");
    }

    if (props.discount !== undefined && props.discount !== null && (props.discount < 0 || props.discount > 100)) {
      throw new Error("Discount must be between 0 and 100");
    }
  }

  // Getters
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

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business logic methods
  getFinalPrice(): number {
    if (this._discount && this._discount > 0) {
      return this._coursePrice - (this._coursePrice * this._discount / 100);
    }
    return this._coursePrice;
  }

  hasDiscount(): boolean {
    return this._discount !== null && this._discount > 0;
  }

  hasCoupon(): boolean {
    return this._couponId !== null && this._couponId.trim() !== "";
  }

  getDiscountAmount(): number {
    if (this._discount && this._discount > 0) {
      return this._coursePrice * this._discount / 100;
    }
    return 0;
  }
} 