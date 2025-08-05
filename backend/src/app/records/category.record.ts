export interface CategoryRecord {
  id: string;
  name: string;
  description?: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
} 