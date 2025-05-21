import { z } from "zod";
import {
  CreateInstructorRequestDTO,
  UpdateInstructorRequestDTO,
  ApproveInstructorRequestDTO,
  DeclineInstructorRequestDTO,
  GetInstructorByUserIdRequestDTO,
  GetAllInstructorsRequestDTO,
} from "../../domain/dtos/instructor/instructor.dto";
import { APPROVALSTATUS } from "../../domain/enum/approval-status.enum";

interface ValidationSchema {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}

// Schemas
const createInstructorSchema = z.object({
  areaOfExpertise: z.string().min(1, "Area of expertise is required"),
  professionalExperience: z.string().min(1, "Professional experience is required"),
  about: z.string().optional(),
  website: z.string().url().optional(),
});

const updateInstructorSchema = z.object({
  id: z.string().min(1, "Instructor ID is required"),
  areaOfExpertise: z.string().min(1).optional(),
  professionalExperience: z.string().min(1).optional(),
  about: z.string().optional(),
  website: z.string().url().optional(),
  status: z
    .enum([APPROVALSTATUS.PENDING, APPROVALSTATUS.APPROVED, APPROVALSTATUS.DECLINED])
    .optional(),
});

const approveInstructorSchema = z.object({
  instructorId: z.string().min(1, "Instructor ID is required"),
});

const declineInstructorSchema = z.object({
  instructorId: z.string().min(1, "Instructor ID is required"),
});

const getInstructorByUserIdSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

const getAllInstructorsSchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/)
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  limit: z
    .string()
    .regex(/^\d+$/)
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  status: z
    .enum([APPROVALSTATUS.PENDING, APPROVALSTATUS.APPROVED, APPROVALSTATUS.DECLINED])
    .optional(),
});

// Validation schemas for endpoints
export const createInstructorSchemaDef: ValidationSchema = {
  body: createInstructorSchema,
};

export const updateInstructorSchemaDef: ValidationSchema = {
  body: updateInstructorSchema,
};

export const approveInstructorSchemaDef: ValidationSchema = {
  body: approveInstructorSchema,
};

export const declineInstructorSchemaDef: ValidationSchema = {
  body: declineInstructorSchema,
};

export const getInstructorByUserIdSchemaDef: ValidationSchema = {
  params: getInstructorByUserIdSchema,
};

export const getAllInstructorsSchemaDef: ValidationSchema = {
  query: getAllInstructorsSchema,
};

// Validation functions
export function validateCreateInstructor(data: unknown): CreateInstructorRequestDTO {
  return createInstructorSchema.parse(data);
}

export function validateUpdateInstructor(data: unknown): UpdateInstructorRequestDTO {
  return updateInstructorSchema.parse(data);
}

export function validateApproveInstructor(data: unknown): ApproveInstructorRequestDTO {
  return approveInstructorSchema.parse(data);
}

export function validateDeclineInstructor(data: unknown): DeclineInstructorRequestDTO {
  return declineInstructorSchema.parse(data);
}

export function validateGetInstructorByUserId(data: unknown): GetInstructorByUserIdRequestDTO {
  return getInstructorByUserIdSchema.parse(data);
}

export function validateGetAllInstructors(data: unknown): GetAllInstructorsRequestDTO {
  return getAllInstructorsSchema.parse(data);
}
