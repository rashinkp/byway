import { z } from "zod";

export const GetAllOrdersDtoSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  sortBy: z.enum(["createdAt", "amount", "status"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  status: z.enum(["ALL", "COMPLETED", "PENDING", "FAILED"]).default("ALL"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
});

export type GetAllOrdersDto = z.infer<typeof GetAllOrdersDtoSchema>;

export const CourseDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  level: z.string(),
  price: z.number(),
  thumbnail: z.string().nullable(),
  status: z.string(),
  categoryId: z.string(),
  createdBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
  approvalStatus: z.string(),
  details: z.any().nullable(),
});

export const OrderItemDtoSchema = z.object({
  orderId: z.string(),
  courseId: z.string(),
  courseTitle: z.string(),
  coursePrice: z.number(),
  discount: z.number().nullable(),
  couponId: z.string().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  level: z.string(),
  price: z.number().nullable(),
  thumbnail: z.string().nullable(),
  status: z.string(),
  categoryId: z.string(),
  createdBy: z.string(),
  deletedAt: z.string().nullable(),
  approvalStatus: z.string(),
  details: z.any().nullable()
});

export const OrderDtoSchema = z.object({
  id: z.string(),
  userId: z.string(),
  amount: z.number(),
  paymentStatus: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]),
  orderStatus: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "FAILED", "COMPLETED"]),
  paymentId: z.string().nullable(),
  paymentGateway: z.enum(["STRIPE", "PAYPAL", "RAZORPAY"]).nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  items: z.array(OrderItemDtoSchema),
});

export const OrdersResponseDtoSchema = z.object({
  orders: z.array(OrderDtoSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export type CourseDto = z.infer<typeof CourseDtoSchema>;
export type OrderItemDto = z.infer<typeof OrderItemDtoSchema>;
export type OrderDto = z.infer<typeof OrderDtoSchema>;
export type OrdersResponseDto = z.infer<typeof OrdersResponseDtoSchema>; 