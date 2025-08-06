import { CartInterface } from "../interfaces/cart";
import { Course } from "./course.entity";
import { User } from "./user.entity";


export class Cart {
  private readonly _id: string;
  private _userId: string;
  private _courseId: string;
  private _couponId?: string;
  private _discount?: number;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt?: Date | null;
  private _user?: User;
  private _course?: Course;

  constructor(props: CartInterface) {
    if (!props.userId) {
      throw new Error("User ID is required");
    }
    if (!props.courseId) {
      throw new Error("Course ID is required");
    }
    if (props.discount && props.discount < 0) {
      throw new Error("Discount cannot be negative");
    }

    this._id = props.id;
    this._userId = props.userId;
    this._courseId = props.courseId;
    this._couponId = props.couponId;
    this._discount = props.discount;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt ?? null;
    this._user = props.user;
    this._course = props.course;
  }

  applyDiscount(discount: number): void {
    if (discount < 0) {
      throw new Error("Discount cannot be negative");
    }
    this._discount = discount;
    this._updatedAt = new Date();
  }

  applyCoupon(couponId: string): void {
    if (!couponId) {
      throw new Error("Coupon ID is required");
    }
    this._couponId = couponId;
    this._updatedAt = new Date();
  }

  removeCoupon(): void {
    this._couponId = undefined;
    this._discount = undefined;
    this._updatedAt = new Date();
  }

  softDelete(): void {
    if (this._deletedAt) {
      throw new Error("Cart item is already deleted");
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  restore(): void {
    if (!this._deletedAt) {
      throw new Error("Cart item is not deleted");
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

  get userId(): string {
    return this._userId;
  }

  get courseId(): string {
    return this._courseId;
  }

  get couponId(): string | undefined {
    return this._couponId;
  }

  get discount(): number | undefined {
    return this._discount;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt ?? null;
  }

  get user(): User | undefined {
    return this._user;
  }

  get course(): Course | undefined {
    return this._course;
  }
}
