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
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  role: z.enum([Role.USER, Role.INSTRUCTOR, Role.ADMIN]).optional(),
  includeDeleted: z.boolean().optional(),
});

export const adminUpdateUserSchema = z.object({
  userId: z.string().uuid(),
  deletedAt: z.date().nullable().optional(),
});
