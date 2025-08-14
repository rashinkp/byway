export interface ICreateCategoryInputDTO {
  name: string;
  description: string;
  createdBy: string;
}

export interface IUpdateCategoryInputDTO {
  id: string; // Category ID
  name?: string; // Optional, to update the category name
  description?: string; // Optional, to update the description
}

// Input DTO for retrieving all categories with pagination, search, and sorting
export interface IGetAllCategoriesInputDTO {
  page?: number; 
  limit?: number; 
  search?: string;
  includeDeleted?: boolean; 
  sortBy?: string; // Field to sort by (e.g., "name", "createdAt")
  sortOrder?: "asc" | "desc"; // Sort order (default: "asc")
  filterBy?: string; // Additional filtering criteria (e.g., "All")
}

// Input DTO for retrieving, deleting, or recovering a category by ID
export interface ICategoryIdInputDTO {
  id: string; // Category ID
}

// Output DTO for a single category
export interface ICategoryOutputDTO {
  id: string;
  name: string;
  description?: string;
  createdBy: string; // User ID of the creator
  createdAt: string; // ISO string for Date
  updatedAt: string; // ISO string for Date
  deletedAt?: string; // ISO string for Date, optional for soft deletion
}

// Output DTO for paginated list of categories
export interface ICategoryListOutputDTO {
  categories: ICategoryOutputDTO[]; // Array of categories
  total: number; // Total number of categories matching the criteria
}
