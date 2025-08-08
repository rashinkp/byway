import z from "zod";

export const getOverallRevenueSchema = z.object({
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
});

export const getCourseRevenueSchema = z.object({
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
  sortBy: z.enum(["revenue", "enrollments", "name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional(),
  page: z
    .string()
    .transform((str) => parseInt(str))
    .optional(),
  limit: z
    .string()
    .transform((str) => parseInt(str))
    .optional(),
});

export const getLatestRevenueSchema = z.object({
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
  page: z
    .string()
    .transform((str) => parseInt(str))
    .optional(),
  limit: z
    .string()
    .transform((str) => parseInt(str))
    .optional(),
  search: z.string().optional(),
  sortBy: z.enum(["latest", "oldest"]).optional(),
});
