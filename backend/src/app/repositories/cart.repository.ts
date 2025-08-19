import { Cart } from "../../domain/entities/cart.entity";
import { IGenericRepository } from "./base/generic-repository.interface";

export interface ICartRepository extends IGenericRepository<Cart> {
  findByUserId(userId: string, includeDeleted?: boolean): Promise<Cart[]>;
  findByCourseId(courseId: string, includeDeleted?: boolean): Promise<Cart[]>;
  findByUserAndCourse(userId: string, courseId: string): Promise<Cart | null>;
  clearUserCart(userId: string): Promise<void>;
  deleteByUserAndCourse(userId: string, courseId: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
  countByUserId(userId: string): Promise<number>;
} 