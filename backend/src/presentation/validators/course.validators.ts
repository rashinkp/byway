import { z } from "zod";
import {
  ICreateCourseInputDTO,
  IUpdateCourseInputDTO,
  IGetAllCoursesInputDTO,
  IGetEnrolledCoursesInputDTO,
  ICreateEnrollmentInputDTO,
  IUpdateCourseApprovalInputDTO,
} from "../../app/dtos/course.dto";
import { CourseLevel } from "../../domain/enum/course-level.enum";
import { CourseStatus } from "../../domain/enum/course-status.enum";

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
const uuidSchema = z.string().uuid("Invalid UUID");

// Common schema for course fields
const courseFieldsSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title cannot exceed 255 characters"),
  description: z.string().optional().nullable(),
  categoryId: uuidSchema,
  price: z
    .number()
    .nonnegative("Price must be non-negative")
    .optional()
    .nullable(),
  duration: z.number().optional().nullable(),
  level: z.enum(courseLevelValues),
  // Accept S3 key or any non-empty path string
  thumbnail: z
    .string()
    .min(1)
    .optional()
    .nullable(),
  offer: z
    .number()
    .min(0, "Offer must be non-negative")
    .max(100, "Offer cannot exceed 100")
    .optional()
    .nullable(),
  status: z.enum(courseStatusValues).default(CourseStatus.DRAFT),
  adminSharePercentage: z
    .number()
    .min(0.01, "Admin share must be at least 0.01%")
    .max(100, "Admin share cannot exceed 100%")
    .default(20),
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

// Schemas
const createCourseSchema = courseFieldsSchema as z.ZodType<
  Omit<ICreateCourseInputDTO, "createdBy">
>;
const updateCourseSchema = z.object({
  ...courseFieldsSchema.partial().shape,
  adminSharePercentage: z
    .number()
    .min(0.01, "Admin share must be at least 0.01%")
    .max(100, "Admin share cannot exceed 100%")
    .default(20),
}) as z.ZodType<Partial<Omit<IUpdateCourseInputDTO, "createdBy" | "id">>>;
const courseIdSchema = z.object({
  id: uuidSchema,
});
const getAllCoursesSchema = z.object({
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
    .enum([
      "All",
      "Active",
      "Inactive",
      "Approved",
      "Declined",
      "Pending",
      "Published",
      "Draft",
      "Archived",
    ])
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
  categoryId: uuidSchema.optional(),
});
const createEnrollmentSchema = z.object({
  courseIds: z.array(uuidSchema).min(1, "At least one course ID is required"),
});
const getEnrolledCoursesSchema = z.object({
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
});
const updateCourseApprovalSchema = z.object({
  courseId: uuidSchema,
});

// Validation schemas for endpoints
export const createCourseSchemaDef: ValidationSchema = {
  body: createCourseSchema,
};

export const updateCourseSchemaDef: ValidationSchema = {
  params: courseIdSchema,
  body: updateCourseSchema,
};

export const getAllCoursesSchemaDef: ValidationSchema = {
  query: getAllCoursesSchema,
};

export const getCourseByIdSchemaDef: ValidationSchema = {
  params: courseIdSchema,
};

export const deleteCourseSchemaDef: ValidationSchema = {
  params: courseIdSchema,
};

export const createEnrollmentSchemaDef: ValidationSchema = {
  body: createEnrollmentSchema,
};

export const getEnrolledCoursesSchemaDef: ValidationSchema = {
  query: getEnrolledCoursesSchema,
};

export const updateCourseApprovalSchemaDef: ValidationSchema = {
  body: updateCourseApprovalSchema,
};

// Validation functions
export function validateCreateCourse(
  data: unknown
): Omit<ICreateCourseInputDTO, "createdBy"> {
  return createCourseSchema.parse(data);
}

export function validateUpdateCourse(
  data: unknown
): Partial<Omit<IUpdateCourseInputDTO, "createdBy" | "id">> {
  return updateCourseSchema.parse(data);
}

export function validateGetAllCourses(data: unknown): IGetAllCoursesInputDTO {
  return getAllCoursesSchema.parse(data);
}

export function validateGetCourseById(data: unknown): { id: string } {
  return courseIdSchema.parse(data);
}

export function validateDeleteCourse(data: unknown): { id: string } {
  return courseIdSchema.parse(data);
}

export function validateCreateEnrollment(
  data: unknown
): Omit<ICreateEnrollmentInputDTO, "userId"> {
  return createEnrollmentSchema.parse(data);
}

export function validateGetEnrolledCourses(
  data: unknown
): Omit<IGetEnrolledCoursesInputDTO, "userId"> {
  return getEnrolledCoursesSchema.parse(data);
}

export function validateUpdateCourseApproval(
  data: unknown
): IUpdateCourseApprovalInputDTO {
  return updateCourseApprovalSchema.parse(data);
}
