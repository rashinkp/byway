import { PrismaClient } from "@prisma/client";
import {
  ICart,
  ICreateCartInput,
  IGetCartInput,
  IRemoveCartItemInput,
  IClearCartInput,
} from "./cart.types";
import { ICartRepository } from "./cart.repository.interface";

export class CartRepository implements ICartRepository {
  constructor(private prisma: PrismaClient) {}

  async createCart(input: ICreateCartInput): Promise<ICart> {
    const { userId, courseId } = input;
    const cartItem = await this.prisma.cart.create({
      data: {
        userId,
        courseId,
      },
      select: {
        id: true,
        userId: true,
        courseId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
    return {
      id: cartItem.id,
      userId: cartItem.userId,
      courseId: cartItem.courseId,
      createdAt: cartItem.createdAt,
      updatedAt: cartItem.updatedAt,
      deletedAt: cartItem.deletedAt || null,
    };
  }

  async getCart(
    input: IGetCartInput
  ): Promise<{ cartItems: ICart[]; total: number }> {
    const { userId, page = 1, limit = 10, includeDeleted = false } = input;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (!includeDeleted) {
      where.deletedAt = null;
    }

    const [cartItems, total] = await Promise.all([
      this.prisma.cart.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          userId: true,
          courseId: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
      }),
      this.prisma.cart.count({ where }),
    ]);

    return {
      cartItems: cartItems.map((item) => ({
        id: item.id,
        userId: item.userId,
        courseId: item.courseId,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        deletedAt: item.deletedAt || null,
      })),
      total,
    };
  }

  async removeCartItem(input: IRemoveCartItemInput): Promise<ICart> {
    const { userId, courseId } = input;
    const cartItem = await this.prisma.cart.update({
      where: {
        userId_courseId: { userId, courseId },
      },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        userId: true,
        courseId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
    return {
      id: cartItem.id,
      userId: cartItem.userId,
      courseId: cartItem.courseId,
      createdAt: cartItem.createdAt,
      updatedAt: cartItem.updatedAt,
      deletedAt: cartItem.deletedAt || null,
    };
  }

  async clearCart(input: IClearCartInput): Promise<void> {
    const { userId } = input;
    await this.prisma.cart.updateMany({
      where: {
        userId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async getCartItemByCourseId(
    userId: string,
    courseId: string
  ): Promise<ICart | null> {
    const cartItem = await this.prisma.cart.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
      select: {
        id: true,
        userId: true,
        courseId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
    return cartItem
      ? {
          id: cartItem.id,
          userId: cartItem.userId,
          courseId: cartItem.courseId,
          createdAt: cartItem.createdAt,
          updatedAt: cartItem.updatedAt,
          deletedAt: cartItem.deletedAt || null,
        }
      : null;
  }
}
