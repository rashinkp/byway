import { z } from "zod";

export const SearchParamsSchema = z.object({
  query: z.string().min(1),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});

export type SearchParams = z.infer<typeof SearchParamsSchema> & { userId?: string };

export interface ISearchResult {
  instructors: {
    items: {
      id: string;
      name: string;
      avatar: string | null;
      shortBio: string;
    }[];
    total: number;
    page: number;
    limit: number;
  };
  courses: {
    items: {
      id: string;
      title: string;
      thumbnail: string | null;
      price: number;
      offer?: number;
    }[];
    total: number;
    page: number;
    limit: number;
  };
  categories: {
    items: {
      id: string;
      title: string;
      description: string;
    }[];
    total: number;
    page: number;
    limit: number;
  };
  certificates: {
    items: {
      id: string;
      certificateNumber: string;
      courseTitle: string;
      userName: string;
      issuedAt: string | null;
      pdfUrl: string;
    }[];
    total: number;
    page: number;
    limit: number;
  };
} 