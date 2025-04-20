export interface Category {
  id: string;
  name: string;
  description?: string;
  deletedAt?: Date;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
}