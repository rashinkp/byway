import { IOrderRepository } from "../../../repositories/order.repository";
import { IGetAllOrdersUseCase } from "../interfaces/get-all-orders.usecase.interface";
import { GetAllOrdersDto } from "../../../dtos/order.dto";

export class GetAllOrdersUseCase implements IGetAllOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(userId: string, filters: GetAllOrdersDto) {
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

      // Build where clause
      const where: any = { userId };

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
        if (minAmount !== undefined) where.amount.gte = minAmount;
        if (maxAmount !== undefined) where.amount.lte = maxAmount;
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
        orders,
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
