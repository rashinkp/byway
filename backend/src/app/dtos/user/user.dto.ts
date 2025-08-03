import { z } from "zod";


export interface ICreateUserProfileRequestDTO {
  userId: string;
  bio?: string;
  education?: string;
  skills?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  dateOfBirth?: Date;
  gender?: string;
}

export interface IUpdateUserProfileRequestDTO {
  id: string;
  bio?: string;
  education?: string;
  skills?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  dateOfBirth?: Date;
  gender?: string;
}



// Get All Users DTO
export const GetAllUsersDtoSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  sortBy: z.enum(["name", "email", "createdAt", "updatedAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  includeDeleted: z.coerce.boolean().default(false),
  search: z.string().optional(),
  filterBy: z.enum(["All", "Active", "Inactive"]).optional(),
  role: z.enum(["USER", "INSTRUCTOR", "ADMIN"]).optional(),
});

export type GetAllUsersDto = z.infer<typeof GetAllUsersDtoSchema>;

export function validateGetAllUsers(data: unknown): GetAllUsersDto {
  return GetAllUsersDtoSchema.parse(data);
}

// Toggle Delete DTO
export const ToggleDeleteUserDtoSchema = z.object({
  id: z.string().uuid(),
});

export type ToggleDeleteUserDto = z.infer<typeof ToggleDeleteUserDtoSchema>;

export function validateToggleDeleteUser(data: unknown): ToggleDeleteUserDto {
  return ToggleDeleteUserDtoSchema.parse(data);
}

// Update User DTO
export const UpdateUserDtoSchema = z.object({
  name: z.string().min(1).optional(),
  avatar: z.string().url().optional().or(z.literal("")),
  bio: z.string().optional(),
  education: z.string().optional(),
  skills: z.string().optional(),
  phoneNumber: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  role: z.enum(['USER', 'INSTRUCTOR', 'ADMIN']).optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;

export function validateUpdateUser(data: unknown): UpdateUserDto {
  return UpdateUserDtoSchema.parse(data);
}

// Get User DTO
export const GetUserDtoSchema = z.object({
  userId: z.string().uuid(),
});

export type GetUserDto = z.infer<typeof GetUserDtoSchema>;

export function validateGetUser(data: unknown): GetUserDto {
  return GetUserDtoSchema.parse(data);
}
