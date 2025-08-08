import { z } from "zod";

// AddToCart DTO schema
export const AddToCartDtoSchema = z.object({
  courseId: z.string().uuid(),
  couponId: z.string().uuid().optional(),
});

export type AddToCartDto = z.infer<typeof AddToCartDtoSchema>;

export function validateAddToCart(data: unknown): AddToCartDto {
  return AddToCartDtoSchema.parse(data);
}

// GetCart DTO schema
export const GetCartDtoSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  includeDeleted: z.coerce.boolean().default(false),
});

export type GetCartDto = z.infer<typeof GetCartDtoSchema>;

export function validateGetCart(data: unknown): GetCartDto {
  return GetCartDtoSchema.parse(data);
}

// RemoveFromCart DTO schema
export const RemoveFromCartDtoSchema = z.object({
  courseId: z.string().uuid(),
});

export type RemoveFromCartDto = z.infer<typeof RemoveFromCartDtoSchema>;

export function validateRemoveFromCart(data: unknown): RemoveFromCartDto {
  return RemoveFromCartDtoSchema.parse(data);
}

// ApplyCoupon DTO schema
export const ApplyCouponDtoSchema = z.object({
  courseId: z.string().uuid(),
  couponId: z.string().uuid(),
});

export type ApplyCouponDto = z.infer<typeof ApplyCouponDtoSchema>;

export function validateApplyCoupon(data: unknown): ApplyCouponDto {
  return ApplyCouponDtoSchema.parse(data);
}
