import { z } from "zod";


export const CourseDetailSchema = z.object({
  prerequisites: z.string().nullable(),
  longDescription: z.string().nullable(),
  objectives: z.string().nullable(),
  targetAudience: z.string().nullable(),
});

export const CreateOrderCourseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  level: z.string(),
  price: z.number(),
  thumbnail: z.string().nullable(),
  status: z.string(), // required
  categoryId: z.string().optional(), // optional in DTO
  createdBy: z.string(), // required
  createdAt: z.string(), // required
  updatedAt: z.string().optional(),
  deletedAt: z.string().nullable(), // required but nullable
  approvalStatus: z.string(), // required
  details: CourseDetailSchema.nullable(), // required but can be null
  offer: z.number().optional(),
});

export const CreateOrderDtoSchema = z.object({
  courses: z.array(CreateOrderCourseSchema),
  paymentMethod: z.enum(["WALLET", "STRIPE", "PAYPAL", "RAZORPAY"]),
  couponCode: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
  paymentStatus: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]),
  paymentId: z.string().optional(),
  paymentGateway: z
    .enum(["STRIPE", "PAYPAL", "RAZORPAY"])
    .nullable()
    .optional(),
});
