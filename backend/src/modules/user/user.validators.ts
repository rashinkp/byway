import { z } from "zod";
import { Role } from "@prisma/client";

export const updateUserSchema = z.object({
  userId: z.string().uuid(),
  user: z
    .object({
      name: z.string().min(1).max(100).optional(),
      password: z
        .string()
        .min(8)
        .max(100)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
          message: "Password must contain uppercase, lowercase, and numbers",
        })
        .optional(),
      avatar: z.string().url().max(500).optional(),
      googleId: z.string().optional(),
    })
    .optional(),
  profile: z
    .object({
      bio: z.string().max(500).optional(),
      education: z.string().max(200).optional(),
      skills: z.string().max(200).optional(),
      phoneNumber: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/)
        .optional(),
      country: z.string().max(100).optional(),
      city: z.string().max(100).optional(),
      address: z.string().max(200).optional(),
      dateOfBirth: z
        .string()
        .datetime()
        .optional()
        .transform((val) => (val ? new Date(val) : undefined)),
      gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    })
    .optional(),
  
});

export const getAllUsersSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().optional().default(10),
  sortBy: z
    .enum(["name", "createdAt", "updatedAt"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
  includeDeleted: z.boolean().optional().default(false),
  search: z.string().optional().default(""),
  filterBy: z.enum(["All", "Active", "Inactive"]).optional().default("All"),
});

export const adminUpdateUserSchema = z.object({
  userId: z.string().uuid(),
  deletedAt: z.date().nullable().optional(),
});

export const findUserByEmailSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const findUserByIdSchema = z.object({
  id: z.string().uuid("Invalid user ID"),
});

export const updateUserRoleSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  role: z.enum([Role.USER, Role.INSTRUCTOR, Role.ADMIN], {
    message: "Invalid role",
  }),
});
