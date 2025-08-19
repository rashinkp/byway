import { PrismaClient, Prisma } from "@prisma/client";
import { Cart } from "../../domain/entities/cart.entity";
import { ICartRepository } from "../../app/repositories/cart.repository";
import { GenericRepository } from "./base/generic.repository";

export class CartRepository extends GenericRepository<Cart> implements ICartRepository {
  constructor(private _prisma: PrismaClient) {
    super(_prisma, 'cart');
  }

  protected getPrismaModel() {
    return this._prisma.cart;
  }

  protected mapToEntity(cart: any): Cart {
    return Cart.fromPersistence({
      ...cart,
      discount: Number(cart.discount),
    });
  }

  protected mapToPrismaData(entity: any): any {
    if (entity instanceof Cart) {
      return {
        userId: entity.userId,
        courseId: entity.courseId,
        couponId: entity.couponId,
        discount: new Prisma.Decimal(entity.discount ?? 0),
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        deletedAt: entity.deletedAt,
      };
    }
    return entity;
  }

  async findById(id: string): Promise<Cart | null> {
    const cart = await this._prisma.cart.findUnique({
      where: { id },
      include: {
        course: true,
      },
    });
    if (!cart) return null;
    return this.mapToEntity(cart);
  }

  async findByUserId(
    userId: string,
    includeDeleted: boolean = false
  ): Promise<Cart[]> {
    const carts = await this._prisma.cart.findMany({
      where: {
        userId,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
      include: {
        course: true,
      },
    });
    return carts.map((cart) =>
      Cart.fromPersistence({
        ...cart,
        discount: Number(cart.discount),
      })
    );
  }

  async findByCourseId(
    courseId: string,
    includeDeleted: boolean = false
  ): Promise<Cart[]> {
    const carts = await this._prisma.cart.findMany({
      where: {
        courseId,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
      include: {
        course: true,
      },
    });
    return carts.map((cart) =>
      Cart.fromPersistence({
        ...cart,
        discount: Number(cart.discount),
      })
    );
  }

  async findByUserAndCourse(
    userId: string,
    courseId: string
  ): Promise<Cart | null> {
    const cart = await this._prisma.cart.findFirst({
      where: {
        userId,
        courseId,
      },
      include: {
        course: true,
      },
    });
    if (!cart) return null;
    return Cart.fromPersistence({
      ...cart,
      discount: Number(cart.discount),
    });
  }

  async create(cart: Cart): Promise<Cart> {
    const created = await this._prisma.cart.create({
      data: {
        userId: cart.userId,
        courseId: cart.courseId,
        couponId: cart.couponId,
        discount: new Prisma.Decimal(cart.discount ?? 0),
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
        deletedAt: cart.deletedAt,
      },
      include: {
        course: true,
      },
    });
    return Cart.fromPersistence({
      ...created,
      discount: Number(created.discount),
    });
  }

  async update(id: string, cart: Cart): Promise<Cart> { 
    const updated = await this._prisma.cart.update({
      where: { id },
      data: {
        userId: cart.userId,
        courseId: cart.courseId,
        couponId: cart.couponId,
        discount: new Prisma.Decimal(cart.discount ?? 0),
        updatedAt: new Date(),
        deletedAt: cart.deletedAt,
      },
      include: {
        course: true,
      },
    });
    return Cart.fromPersistence({
      ...updated,
      discount: Number(updated.discount),
    });
  }

  // Additional generic methods
  async find(filter?: any): Promise<Cart[]> {
    return this.findGeneric(filter);
  }

  async softDelete(id: string): Promise<Cart> {
    const deleted = await this._prisma.cart.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        course: true,
      },
    });
    return this.mapToEntity(deleted);
  }

  async count(filter?: any): Promise<number> {
    return this.countGeneric(filter);
  }

  async delete(id: string): Promise<void> {
    await this._prisma.cart.delete({
      where: { id },
    });
  }

  async clearUserCart(userId: string): Promise<void> {
    await this._prisma.cart.deleteMany({
      where: {
        userId,
      },
    });
  }

  async deleteByUserAndCourse(userId: string, courseId: string): Promise<void> {
    await this._prisma.cart.deleteMany({
      where: {
        userId,
        courseId,
      },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this._prisma.cart.updateMany({
      where: {
        userId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async countByUserId(userId: string): Promise<number> {
    return this._prisma.cart.count({ where: { userId, deletedAt: null } });
  }
}
