import { PrismaClient } from "@prisma/client";
import { CartRecord } from "../../app/records/cart.record";
import { ICartRepository } from "../../app/repositories/cart.repository";

export class CartRepository implements ICartRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<CartRecord | null> {
    const cart = await this.prisma.cart.findUnique({
      where: { id },
      include: {
        course: true
      }
    });
    return cart;
  }

  async findByUserId(userId: string, includeDeleted: boolean = false): Promise<CartRecord[]> {
    const carts = await this.prisma.cart.findMany({
      where: {
        userId,
        ...(includeDeleted ? {} : { deletedAt: null })
      },
      include: {
        course: true
      }
    });
    return carts;
  }

  async findByCourseId(courseId: string, includeDeleted: boolean = false): Promise<CartRecord[]> {
    const carts = await this.prisma.cart.findMany({
      where: {
        courseId,
        ...(includeDeleted ? {} : { deletedAt: null })
      },
      include: {
        course: true
      }
    });
    return carts;
  }

  async findByUserAndCourse(userId: string, courseId: string): Promise<CartRecord | null> {
    const cart = await this.prisma.cart.findFirst({
      where: {
        userId,
        courseId,
      },
      include: {
        course: true
      }
    });
    return cart;
  }

  async create(cart: CartRecord): Promise<CartRecord> {
    const created = await this.prisma.cart.create({
      data: cart,
      include: {
        course: true
      }
    });
    return created;
  }

  async update(cart: CartRecord): Promise<CartRecord> {
    const updated = await this.prisma.cart.update({
      where: { id: cart.id },
      data: cart,
      include: {
        course: true
      }
    });
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.cart.delete({
      where: { id }
    });
  }

  async clearUserCart(userId: string): Promise<void> {
    await this.prisma.cart.deleteMany({
      where: { userId }
    });
  }

  async deleteByUserAndCourse(userId: string, courseId: string): Promise<void> {
    await this.prisma.cart.deleteMany({
      where: {
        userId,
        courseId
      }
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.cart.deleteMany({
      where: { userId }
    });
  }

  async countByUserId(userId: string): Promise<number> {
    return this.prisma.cart.count({
      where: { userId }
    });
  }
} 