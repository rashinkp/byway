import { Cart } from "../../../../domain/entities/cart.entity";
import { ApplyCouponDto } from "../../../../domain/dtos/cart/cart.dto";

export interface IApplyCouponUseCase {
  execute(userId: string, data: ApplyCouponDto): Promise<Cart>;
} 