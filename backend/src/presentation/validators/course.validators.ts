import { z } from "zod";
import { CourseLevel } from "../../domain/enum/course-level.enum";
import { CourseStatus } from "../../domain/enum/course-status.enum";
import {
  ICreateCourseInputDTO,
  ICreateEnrollmentInputDTO,
  IGetAllCoursesInputDTO,
  IGetEnrolledCoursesInputDTO,
  IUpdateCourseApprovalInputDTO,
  IUpdateCourseInputDTO,
} from "../../domain/dtos/course/course.dto";
import { Price } from "../../domain/value-object/price";
import { Duration } from "../../domain/value-object/duration";
import { Offer } from "../../domain/value-object/offer";

interface ValidationSchema {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}

const courseLevelValues = Object.values(CourseLevel) as [
  CourseLevel,
  ...CourseLevel[]
];
const courseStatusValues = Object.values(CourseStatus) as [
  CourseStatus,
  ...CourseStatus[]
];

// Common schema for course fields (used in create and update)
const courseFieldsSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title cannot exceed 255 characters"),
  description: z.string().optional().nullable(),
  categoryId: z.string().uuid("Invalid category ID"),
  price: z
    .number()
    .nonnegative("Price must be non-negative")
    .optional()
    .nullable()
    .transform((val) =>
      val !== null && val !== undefined ? Price.create(val) : val
    ),
  duration: z
    .number()
    .optional()
    .nullable()
    .transform((val) =>
      val !== null && val !== undefined ? Duration.create(val) : val
    ),
  level: z.enum(courseLevelValues),
  thumbnail: z.string().url("Invalid URL").optional().nullable(),
  offer: z
    .number()
    .min(0, "Offer must be non-negative")
    .max(100, "Offer cannot exceed 100")
    .optional()
    .nullable()
    .transform((val) =>
      val !== null && val !== undefined ? Offer.create(val) : val
    ),
  status: z.enum(courseStatusValues).default(CourseStatus.DRAFT),
  details: z
    .object({
      prerequisites: z.string().optional().nullable(),
      longDescription: z.string().optional().nullable(),
      objectives: z.string().optional().nullable(),
      targetAudience: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
});

// Body schema for creating a course
const createCourseBodySchema = courseFieldsSchema as z.ZodType<
  Omit<ICreateCourseInputDTO, "createdBy">
>;

// Validation schema for create course endpoint
export const createCourseSchema: ValidationSchema = {
  body: createCourseBodySchema,
};

// Body schema for updating a course
const updateCourseBodySchema = courseFieldsSchema.partial() as z.ZodType<
  Partial<Omit<IUpdateCourseInputDTO, "createdBy" | "id">>
>;

// Params schema for course ID
const courseIdParamsSchema = z.object({
  id: z.string().uuid("Invalid course ID"),
});

// Validation schema for update course endpoint
export const updateCourseSchema: ValidationSchema = {
  params: courseIdParamsSchema,
  body: updateCourseBodySchema,
};

// Query schema for getting all courses
const getAllCoursesQuerySchema = z.object({
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
    .default(10)
    .optional(),
  sortBy: z
    .enum(["title", "createdAt", "updatedAt", "price", "duration"])
    .default("createdAt")
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc").optional(),
  includeDeleted: z
    .string()
    .transform((val) => val === "true")
    .default("false")
    .optional(),
  search: z.string().default("").optional(),
  filterBy: z
    .enum(["All", "Active", "Inactive", "Declined"])
    .default("All")
    .optional(),
  myCourses: z
    .string()
    .transform((val) => val === "true")
    .default("false")
    .optional(),
  role: z.enum(["USER", "INSTRUCTOR", "ADMIN"]).default("USER").optional(),
  level: z
    .enum([...courseLevelValues, "All"])
    .default("All")
    .optional(),
  duration: z
    .enum(["All", "Under5", "5to10", "Over10"])
    .default("All")
    .optional(),
  price: z.enum(["All", "Free", "Paid"]).default("All").optional(),
});

// Validation schema for get all courses endpoint
export const getAllCoursesSchema: ValidationSchema = {
  query: getAllCoursesQuerySchema,
};

// Validation schema for get course by ID endpoint
export const getCourseByIdSchema: ValidationSchema = {
  params: courseIdParamsSchema,
};

// Validation schema for delete course endpoint
export const deleteCourseSchema: ValidationSchema = {
  params: courseIdParamsSchema,
};

// Body schema for creating an enrollment
const createEnrollmentBodySchema = z.object({
  courseIds: z
    .array(z.string().uuid("Invalid course ID"))
    .min(1, "At least one course ID is required"),
}) as z.ZodType<Omit<ICreateEnrollmentInputDTO, "userId">>;

// Validation schema for create enrollment endpoint
export const createEnrollmentSchema: ValidationSchema = {
  body: createEnrollmentBodySchema,
};

// Query schema for getting enrolled courses
const getEnrolledCoursesQuerySchema = z.object({
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
    .default(10)
    .optional(),
  sortBy: z
    .enum(["title", "enrolledAt", "createdAt"])
    .default("enrolledAt")
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc").optional(),
  search: z.string().default("").optional(),
  level: z
    .enum([...courseLevelValues, "All"])
    .default("All")
    .optional(),
}) as z.ZodType<Omit<IGetEnrolledCoursesInputDTO, "userId">>;

// Validation schema for get enrolled courses endpoint
export const getEnrolledCoursesSchema: ValidationSchema = {
  query: getEnrolledCoursesQuerySchema,
};

// Body schema for course approval/decline
const updateCourseApprovalBodySchema = z.object({
  courseId: z.string().uuid("Invalid course ID"),
}) as z.ZodType<IUpdateCourseApprovalInputDTO>;

// Validation schema for approve/decline course endpoints
export const updateCourseApprovalSchema: ValidationSchema = {
  body: updateCourseApprovalBodySchema,
};
