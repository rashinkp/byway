
export class Cart {
  private readonly _id: string;
  private _userId: string;
  private _courseId: string;
  private _couponId?: string;
  private _discount?: number;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt?: Date;

  constructor(props: {
    id: string;
    userId: string;
    courseId: string;
    couponId?: string;
    discount?: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  }) {
    this.validateCart(props);
    
    this._id = props.id;
    this._userId = props.userId;
    this._courseId = props.courseId;
    this._couponId = props.couponId;
    this._discount = props.discount;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt;
  }

  private validateCart(props: any): void {
    if (!props.id) {
      throw new Error("Cart ID is required");
    }

    if (!props.userId) {
      throw new Error("User ID is required");
    }

    if (!props.courseId) {
      throw new Error("Course ID is required");
    }

    if (props.discount !== undefined && (props.discount < 0 || props.discount > 100)) {
      throw new Error("Discount must be between 0 and 100");
    }
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

  // Business logic methods
  applyDiscount(discount: number): void {
    if (discount < 0 || discount > 100) {
      throw new Error("Discount must be between 0 and 100");
    }
    this._discount = discount;
    this._updatedAt = new Date();
  }

  applyCoupon(couponId: string): void {
    if (!couponId || couponId.trim() === "") {
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
    this._deletedAt = undefined;
    this._updatedAt = new Date();
  }

  isDeleted(): boolean {
    return this._deletedAt !== undefined;
  }

  isActive(): boolean {
    return !this.isDeleted();
  }

  hasCoupon(): boolean {
    return this._couponId !== undefined;
  }

  hasDiscount(): boolean {
    return this._discount !== undefined && this._discount > 0;
  }
} 