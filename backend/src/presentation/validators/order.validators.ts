import { z } from "zod";

export const getAllOrdersSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});



export const CourseDetailSchema = z.object({
  prerequisites: z.string().nullable(),
  longDescription: z.string().nullable(),
  objectives: z.string().nullable(),
  targetAudience: z.string().nullable(),
});

const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  level: z.string(),
  price: z.number(),
  thumbnail: z.string().nullable(),
  status: z.string(),
  categoryId: z.string().optional(),
  createdBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().nullable(),
  approvalStatus: z.string(),
  details: CourseDetailSchema.nullable().default(null), 
  offer: z.number().optional(),
});

export const CreateOrderDtoSchema = z.object({
  courses: z.array(CourseSchema),
  paymentMethod: z.enum(["WALLET", "STRIPE", "PAYPAL", "RAZORPAY"]),
  couponCode: z.string().optional(),
});



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

// Validator function
export function validateGetAllOrders(data: unknown) {
  return GetAllOrdersDtoSchema.parse(data);
}
