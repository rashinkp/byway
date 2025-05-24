import { PrismaClient, Cart as PrismaCart, Prisma } from "@prisma/client";
import { Cart } from "../../domain/entities/cart.entity";
import { ICartRepository } from "../../app/repositories/cart.repository";

export class CartRepository implements ICartRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Cart | null> {
    const cart = await this.prisma.cart.findUnique({
      where: { id },
      include: {
        course: true
      }
    });
    if (!cart) return null;
    return Cart.fromPrisma({
      ...cart,
      discount: Number(cart.discount)
    });
  }

  async findByUserId(userId: string, includeDeleted: boolean = false): Promise<Cart[]> {
    const carts = await this.prisma.cart.findMany({
      where: {
        userId,
        ...(includeDeleted ? {} : { deletedAt: null })
      },
      include: {
        course: true
      }
    });
    return carts.map(cart => Cart.fromPrisma({
      ...cart,
      discount: Number(cart.discount)
    }));
  }

  async findByCourseId(courseId: string, includeDeleted: boolean = false): Promise<Cart[]> {
    const carts = await this.prisma.cart.findMany({
      where: {
        courseId,
        ...(includeDeleted ? {} : { deletedAt: null })
      },
      include: {
        course: true
      }
    });
    return carts.map(cart => Cart.fromPrisma({
      ...cart,
      discount: Number(cart.discount)
    }));
  }

  async findByUserAndCourse(userId: string, courseId: string): Promise<Cart | null> {
    const cart = await this.prisma.cart.findFirst({
      where: {
        userId,
        courseId,
      },
      include: {
        course: true
      }
    });
    if (!cart) return null;
    return Cart.fromPrisma({
      ...cart,
      discount: Number(cart.discount)
    });
  }

  async create(cart: Cart): Promise<Cart> {
    const created = await this.prisma.cart.create({
      data: {
        id: cart.id,
        userId: cart.userId,
        courseId: cart.courseId,
        couponId: cart.couponId,
        discount: new Prisma.Decimal(cart.discount ?? 0),
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
        deletedAt: cart.deletedAt
      },
      include: {
        course: true
      }
    });
    return Cart.fromPrisma({
      ...created,
      discount: Number(created.discount)
    });
  }

  async update(cart: Cart): Promise<Cart> {
    const updated = await this.prisma.cart.update({
      where: { id: cart.id },
      data: {
        userId: cart.userId,
        courseId: cart.courseId,
        couponId: cart.couponId,
        discount: new Prisma.Decimal(cart.discount ?? 0),
        updatedAt: cart.updatedAt,
        deletedAt: cart.deletedAt
      },
      include: {
        course: true
      }
    });
    return Cart.fromPrisma({
      ...updated,
      discount: Number(updated.discount)
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.cart.delete({
      where: { id }
    });
  }

  async clearUserCart(userId: string): Promise<void> {
    await this.prisma.cart.deleteMany({
      where: {
        userId
      }
    });
  }
} 