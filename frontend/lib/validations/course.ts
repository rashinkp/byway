import { z } from "zod";

export const courseEditSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
    price: z.number().min(0, "Price cannot be negative"),
    duration: z.number().min(1, "Duration must be at least 1 minute"),
    offer: z.number().min(0, "Offer price cannot be negative").optional(),
  })
  .refine(
    (data) => {
      if (data.offer !== undefined) {
        return data.offer <= data.price;
      }
      return true;
    },
    {
      message: "Offer price must be less than or equal to actual price",
      path: ["offer"], // 👈 target field for the error
    }
  );


