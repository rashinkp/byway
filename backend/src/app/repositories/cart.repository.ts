import { CartRecord } from "../records/cart.record";

export interface ICartRepository {
  findById(id: string): Promise<CartRecord | null>;
  findByUserId(userId: string, includeDeleted?: boolean): Promise<CartRecord[]>;
  findByCourseId(courseId: string, includeDeleted?: boolean): Promise<CartRecord[]>;
  findByUserAndCourse(userId: string, courseId: string): Promise<CartRecord | null>;
  create(cart: CartRecord): Promise<CartRecord>;
  update(cart: CartRecord): Promise<CartRecord>;
  delete(id: string): Promise<void>;
  clearUserCart(userId: string): Promise<void>;
  deleteByUserAndCourse(userId: string, courseId: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
  countByUserId(userId: string): Promise<number>;
} 