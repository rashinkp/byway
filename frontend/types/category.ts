export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  creator: { email: string };
  courseCount: number;
  deletedAt: Date | null;
}

export interface CategoryFormData {
  name: string;
  description?: string;
}
