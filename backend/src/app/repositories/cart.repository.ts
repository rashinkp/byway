import { Cart } from "../../domain/entities/cart.entity";

export interface ICartRepository {
  findById(id: string): Promise<Cart | null>;
  findByUserId(userId: string, includeDeleted?: boolean): Promise<Cart[]>;
  findByCourseId(courseId: string, includeDeleted?: boolean): Promise<Cart[]>;
  findByUserAndCourse(userId: string, courseId: string): Promise<Cart | null>;
  create(cart: Cart): Promise<Cart>;
  update(cart: Cart): Promise<Cart>;
  delete(id: string): Promise<void>;
  clearUserCart(userId: string): Promise<void>;
} 