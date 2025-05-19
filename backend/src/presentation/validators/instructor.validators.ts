import { z } from "zod";
import { APPROVALSTATUS } from "../../domain/enum/approval-status.enum";

const createInstructorSchema = z.object({
  areaOfExpertise: z.string().min(1, "Area of expertise is required"),
  professionalExperience: z
    .string()
    .min(1, "Professional experience is required"),
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
    .enum([
      APPROVALSTATUS.PENDING,
      APPROVALSTATUS.APPROVED,
      APPROVALSTATUS.DECLINED,
    ])
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
    .enum([
      APPROVALSTATUS.PENDING,
      APPROVALSTATUS.APPROVED,
      APPROVALSTATUS.DECLINED,
    ])
    .optional(),
});

export function validateCreateInstructor(data: unknown) {
  return createInstructorSchema.parse(data);
}

export function validateUpdateInstructor(data: unknown) {
  return updateInstructorSchema.parse(data);
}

export function validateApproveInstructor(data: unknown) {
  return approveInstructorSchema.parse(data);
}

export function validateDeclineInstructor(data: unknown) {
  return declineInstructorSchema.parse(data);
}

export function validateGetInstructorByUserId(data: unknown) {
  return getInstructorByUserIdSchema.parse(data);
}

export function validateGetAllInstructors(data: unknown) {
  return getAllInstructorsSchema.parse(data);
}
