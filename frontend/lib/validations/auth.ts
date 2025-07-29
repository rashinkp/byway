import z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});


export const resetPasswordSchema = z
  .object({
    newPassword: z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/^(?=.*[a-z])/, "Password must contain at least one lowercase letter")
      .regex(/^(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
      .regex(/^(?=.*\d)/, "Password must contain at least one number")
      .regex(/^(?=.*[@$!%*?&])/, "Password must contain at least one special character (@$!%*?&)")
      .regex(/^\S*$/, "Password cannot contain whitespace")
      .max(128, "Password must be less than 128 characters"),
    confirmPassword: z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/^(?=.*[a-z])/, "Password must contain at least one lowercase letter")
      .regex(/^(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
      .regex(/^(?=.*\d)/, "Password must contain at least one number")
      .regex(/^(?=.*[@$!%*?&])/, "Password must contain at least one special character (@$!%*?&)")
      .regex(/^\S*$/, "Password cannot contain whitespace")
      .max(128, "Password must be less than 128 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });




export const signupSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s\-'\.]+$/, "Name can only contain letters, spaces, hyphens, apostrophes, and periods")
    .regex(/^[a-zA-Z]/, "Name must start with a letter")
    .regex(/[a-zA-Z]$/, "Name must end with a letter")
    .refine((name) => !/\s{2,}/.test(name), "Name cannot contain consecutive spaces")
    .refine((name) => !/^[^a-zA-Z]*$/.test(name), "Name must contain at least one letter"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])/, "Password must contain at least one lowercase letter")
    .regex(/^(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
    .regex(/^(?=.*\d)/, "Password must contain at least one number")
    .regex(/^(?=.*[@$!%*?&])/, "Password must contain at least one special character (@$!%*?&)")
    .regex(/^\S*$/, "Password cannot contain whitespace")
    .max(128, "Password must be less than 128 characters"),
});