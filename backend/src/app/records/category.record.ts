export interface CategoryRecord {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  deletedAt?: Date | null;
} 