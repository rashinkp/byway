import { PrismaClient, Prisma } from "@prisma/client";
import { Cart } from "../../domain/entities/cart.entity";
import { ICartRepository } from "../../app/repositories/cart.repository";
import { GenericRepository } from "./generic.repository";

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
			include: { course: true },
		});
		if (!cart) return null;
		return Cart.fromPersistence({
			...cart,
			discount: Number(cart.discount),
		});
	}

	async findByUserId(
		userId: string,
		includeDeleted: boolean = false
	): Promise<Cart[]> {
		const where: Record<string, unknown> = { userId };
		if (!includeDeleted) where.deletedAt = null;

		const carts = await this._prisma.cart.findMany({
			where,
			include: { course: true },
		});

		return carts.map((cart) =>
			Cart.fromPersistence({ ...cart, discount: Number(cart.discount) })
		);
	}

	async findByCourseId(courseId: string, includeDeleted: boolean = false): Promise<Cart[]> {
		const where: Record<string, unknown> = { courseId };
		if (!includeDeleted) where.deletedAt = null;
		const carts = await this._prisma.cart.findMany({ where, include: { course: true } });
		return carts.map((cart) => Cart.fromPersistence({ ...cart, discount: Number(cart.discount) }));
	}

	async findByUserAndCourse(userId: string, courseId: string): Promise<Cart | null> {
		const cart = await this._prisma.cart.findFirst({
			where: { userId, courseId, deletedAt: null },
			include: { course: true },
		});
		return cart ? Cart.fromPersistence({ ...cart, discount: Number(cart.discount) }) : null;
	}

	async clearUserCart(userId: string): Promise<void> {
		await this._prisma.cart.deleteMany({ where: { userId } });
	}

	async deleteByUserAndCourse(userId: string, courseId: string): Promise<void> {
		await this._prisma.cart.deleteMany({ where: { userId, courseId } });
	}

	async deleteByUserId(userId: string): Promise<void> {
		await this._prisma.cart.deleteMany({ where: { userId } });
	}

	async countByUserId(userId: string): Promise<number> {
		return this._prisma.cart.count({ where: { userId, deletedAt: null } });
	}
}
