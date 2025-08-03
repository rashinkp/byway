import { z } from "zod";
import {
  ICreateUserProfileRequestDTO,
  IUpdateUserProfileRequestDTO,
} from "../../app/dtos/user/user.dto";

interface ValidationSchema {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}

const uuidSchema = z.string().uuid("Invalid UUID");

// Schemas
const createUserProfileSchema = z.object({
  userId: uuidSchema,
  bio: z.string().optional(),
  education: z.string().optional(),
  skills: z.string().optional(),
  phoneNumber: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.string().optional(),
});

const updateUserProfileSchema = z.object({
  id: uuidSchema,
  bio: z.string().optional(),
  education: z.string().optional(),
  skills: z.string().optional(),
  phoneNumber: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.string().optional(),
});

// Validation schemas for endpoints
export const createUserProfileSchemaDef: ValidationSchema = {
  body: createUserProfileSchema,
};

export const updateUserProfileSchemaDef: ValidationSchema = {
  body: updateUserProfileSchema,
};

// Validation functions
export function validateCreateUserProfile(
  data: unknown
): ICreateUserProfileRequestDTO {
  return createUserProfileSchema.parse(data);
}

export function validateUpdateUserProfile(
  data: unknown
): IUpdateUserProfileRequestDTO {
  return updateUserProfileSchema.parse(data);
}
