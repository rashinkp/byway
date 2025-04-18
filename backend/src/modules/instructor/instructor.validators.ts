import { z } from "zod";

export const createInstructorSchema = z.object({
  areaOfExpertise: z
    .string()
    .min(1, "Area of expertise is required")
    .max(200, "Area of expertise must be at most 200 characters"),
  professionalExperience: z
    .string()
    .min(1, "Professional experience is required")
    .max(1000, "Professional experience must be at most 1000 characters"),
  about: z
    .string()
    .min(1, "About is required")
    .max(500, "About must be at most 500 characters"),
  userId: z.string().uuid("Invalid user ID"),
  website: z
    .string()
    .url("Invalid website URL")
    .max(500, "Website URL must be at most 500 characters"),
});
