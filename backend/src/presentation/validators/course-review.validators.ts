import { z } from "zod";
import { CreateCourseReviewDto, QueryCourseReviewDto, UpdateCourseReviewDto } from "../../app/dtos/review.dto";

interface ValidationSchema {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}

const uuidSchema = z.string().uuid("Invalid UUID");

// Create review schema
const createReviewSchema = z.object({
  courseId: uuidSchema,
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  title: z.string().max(100, "Title cannot exceed 100 characters").optional(),
  comment: z
    .string()
    .max(1000, "Comment cannot exceed 1000 characters")
    .optional(),
}) as z.ZodType<CreateCourseReviewDto>;

// Update review schema
const updateReviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5")
    .optional(),
  title: z.string().max(100, "Title cannot exceed 100 characters").optional(),
  comment: z
    .string()
    .max(1000, "Comment cannot exceed 1000 characters")
    .optional(),
}) as z.ZodType<UpdateCourseReviewDto>;

// Query reviews schema
const queryReviewsSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .positive("Page must be positive")
    .default(1)
    .optional(),
  limit: z.coerce
    .number()
    .int()
    .positive("Limit must be positive")
    .max(100, "Limit cannot exceed 100")
    .default(10)
    .optional(),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5")
    .optional(),
  sortBy: z.enum(["rating", "createdAt"]).default("createdAt").optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc").optional(),
  isMyReviews: z.coerce.boolean().default(false).optional(),
  includeDisabled: z.coerce.boolean().default(false).optional(),
}) as z.ZodType<Omit<QueryCourseReviewDto, "courseId">>;

// Review ID schema
const reviewIdSchema = z.object({
  id: uuidSchema,
});

// User reviews query schema (for all reviews by user across all courses)
const userReviewsQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .positive("Page must be positive")
    .default(1)
    .optional(),
  limit: z.coerce
    .number()
    .int()
    .positive("Limit must be positive")
    .max(100, "Limit cannot exceed 100")
    .default(10)
    .optional(),
});

// Validation schemas for endpoints
export const createReviewSchemaDef: ValidationSchema = {
  body: createReviewSchema,
};

export const updateReviewSchemaDef: ValidationSchema = {
  params: reviewIdSchema,
  body: updateReviewSchema,
};

export const deleteReviewSchemaDef: ValidationSchema = {
  params: reviewIdSchema,
};

export const getCourseReviewsSchemaDef: ValidationSchema = {
  params: z.object({ courseId: uuidSchema }),
  query: queryReviewsSchema,
};

export const getUserReviewsSchemaDef: ValidationSchema = {
  query: userReviewsQuerySchema,
};

export const getReviewStatsSchemaDef: ValidationSchema = {
  params: z.object({ courseId: uuidSchema }),
};

export const disableReviewSchemaDef: ValidationSchema = {
  params: reviewIdSchema,
};

// Validation functions
export function validateCreateReview(data: unknown): CreateCourseReviewDto {
  return createReviewSchema.parse(data);
}

export function validateUpdateReview(data: unknown): UpdateCourseReviewDto {
  return updateReviewSchema.parse(data);
}

export function validateQueryReviews(
  data: unknown,
  courseId: string
): QueryCourseReviewDto {
  const queryData = queryReviewsSchema.parse(data);
  return {
    ...queryData,
    courseId,
  };
}

export function validateReviewId(data: unknown): { id: string } {
  return reviewIdSchema.parse(data);
}

export function validateCourseId(data: unknown): { courseId: string } {
  return z.object({ courseId: uuidSchema }).parse(data);
}
