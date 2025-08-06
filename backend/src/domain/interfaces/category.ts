import { CategoryName } from "../value-object/category-name";

export interface CategoryProps {
  id: string;
  name: CategoryName;
  description?: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}