import { IOrderRepository } from "../../../repositories/order.repository";
import { IGetAllOrdersUseCase } from "../interfaces/get-all-orders.usecase.interface";
import { OrdersResponseDto, OrderDto, GetAllOrdersDto } from "../../../dtos/order.dto";

export class GetAllOrdersUseCase implements IGetAllOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(userId: string, filters: GetAllOrdersDto): Promise<OrdersResponseDto> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder,
        status,
        startDate,
        endDate,
        minAmount,
        maxAmount,
      } = filters;

      // Calculate skip for pagination
      const skip = (page - 1) * limit;

      // Build where clause using generic object
      const where: Record<string, unknown> = { userId };

      if (status !== "ALL") {
        where.orderStatus = status;
      }

      if (startDate && endDate) {
        where.createdAt = {
          gte: new Date(startDate),
          lte: new Date(endDate),
        };
      }

      if (minAmount !== undefined || maxAmount !== undefined) {
        where.amount = {};
        if (minAmount !== undefined) (where.amount as Record<string, unknown>).gte = minAmount;
        if (maxAmount !== undefined) (where.amount as Record<string, unknown>).lte = maxAmount;
      }

      // Get total count for pagination
      const total = await this.orderRepository.count(where);

      // Get paginated orders
      const orders = await this.orderRepository.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          items: {
            include: {
              course: true,
            },
          },
        },
      });

      return {
        orders: orders,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch {
      throw new Error("Failed to fetch orders");
    }
  }
}
