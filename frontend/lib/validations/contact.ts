import z from "zod";

export const contactFormSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s\-'\.]+$/, "Name can only contain letters, spaces, hyphens, apostrophes, and periods")
    .regex(/^[a-zA-Z]/, "Name must start with a letter")
    .regex(/[a-zA-Z]$/, "Name must end with a letter")
    .refine((name) => !/\s{2,}/.test(name), "Name cannot contain consecutive spaces")
    .refine((name) => !/^[^a-zA-Z]*$/.test(name), "Name must contain at least one letter"),
  email: z.string()
    .email("Invalid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be less than 100 characters")
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"),
  subject: z.string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must be less than 200 characters")
    .regex(/^[a-zA-Z0-9\s\.,!?;:'"()-]+$/, "Subject contains invalid characters")
    .refine((val) => !/\s{2,}/.test(val), "Subject cannot contain consecutive spaces")
    .refine((val) => !/^[^a-zA-Z]*$/.test(val), "Subject must contain at least one letter"),
  message: z.string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters")
    .refine((val) => /^[\w\s\.,!?;:'"()-]+$/.test(val), "Message contains invalid characters")
    .refine((val) => !/\s{2,}/.test(val), "Message cannot contain consecutive spaces")
    .refine((val) => !/^[^a-zA-Z]*$/.test(val), "Message must contain at least one letter"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;