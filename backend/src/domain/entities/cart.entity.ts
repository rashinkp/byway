import { Course } from "./course.entity";
import { User } from "./user.entity";

export interface CartInterface {
  id: string;
  userId: string;
  courseId: string;
  couponId?: string;
  discount?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  user?: User;
  course?: Course;
}

export class Cart {
  private _id: string;
  private _userId: string;
  private _courseId: string;
  private _couponId?: string;
  private _discount?: number;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt?: Date;
  private _user?: User;
  private _course?: Course;

  private constructor(props: CartInterface) {
    this._id = props.id;
    this._userId = props.userId;
    this._courseId = props.courseId;
    this._couponId = props.couponId;
    this._discount = props.discount;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt;
    this._user = props.user;
    this._course = props.course;
  }

  static create(props: Omit<CartInterface, 'id' | 'createdAt' | 'updatedAt'>): Cart {
    return new Cart({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPrisma(data: {
    id: string;
    userId: string;
    courseId: string;
    couponId?: string | null;
    discount: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
    user?: { id: string; name: string; email: string; role: string; [key: string]: unknown };
    course?: { id: string; title: string; description: string | null; [key: string]: unknown };
  }): Cart {
    return new Cart({
      id: data.id,
      userId: data.userId,
      courseId: data.courseId,
      couponId: data.couponId ?? undefined,
      discount: Number(data.discount),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt ?? undefined,
      user: undefined, // Don't try to reconstruct User entity from incomplete data
      course: undefined, // Don't try to reconstruct Course entity from incomplete data
    });
  }

  // Getters
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

  get deletedAt(): Date | undefined {
    return this._deletedAt;
  }

  get user(): User | undefined {
    return this._user;
  }

  get course(): Course | undefined {
    return this._course;
  }

  // Methods
  applyDiscount(discount: number): void {
    if (discount < 0) {
      throw new Error("Discount cannot be negative");
    }
    this._discount = discount;
    this._updatedAt = new Date();
  }

  applyCoupon(couponId: string): void {
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
    this._deletedAt = undefined;
    this._updatedAt = new Date();
  }

  // Helper method to get all properties
  getProps(): CartInterface {
    return {
      id: this._id,
      userId: this._userId,
      courseId: this._courseId,
      couponId: this._couponId,
      discount: this._discount,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
      user: this._user,
      course: this._course,
    };
  }

  toJSON(): CartInterface {
    return {
      id: this._id,
      userId: this._userId,
      courseId: this._courseId,
      couponId: this._couponId,
      discount: this._discount,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
      user: this._user,
      course: this._course,
    };
  }
} 