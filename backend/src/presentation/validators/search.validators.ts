import z from "zod";

export const SearchParamsSchema = z.object({
  query: z.string().min(1),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});
